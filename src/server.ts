//ファイル関連
import fs from "fs"
//基本的なデータ
import itemsData from "./client/js/data/items.js"
//その他
import { usersDB, floorsDB, facilitiesDB } from "./server/infra/database"
import { sendUsersData, sendFacilitiesData, sendFloorsData, sendEntitiesData } from "./server/function/sendData"
import { checkError } from "./server/function/checkError"
import { serverIO } from "./server/infra/serverIO"

const PORT = 10323

let entities = []

function damageFacilities(doc, damage, where){
  let newFacDoc = doc
  newFacDoc.hp -= damage
  if(newFacDoc.hp <= 0){
    facilitiesDB.remove({tileX:doc.tileX, tileY:doc.tileY}, (error)=>{
      checkError(error)
      sendFacilitiesData()
    })
  }else{
    facilitiesDB.update({tileX:doc.tileX, tileY:doc.tileY}, { $set:newFacDoc }, {}, (error)=>{
      checkError(error)
      sendFacilitiesData()
    })
  }
}

//エンティティの時間による移動
let runTime = false
const runTimeSpan = 20 //エンティティのデータ変更の時間間隔
setInterval(()=>{
  if(runTime){
    let newEntities = []
    entities.forEach((entity)=>{
      let newEntity = entity
      //エンティティの移動
      newEntity.x += Math.cos(entity.direction)*entity.speed
      newEntity.y += Math.sin(entity.direction)*entity.speed
      facilitiesDB.findOne({
        tileX: Math.floor(newEntity.x),
        tileY: Math.floor(newEntity.y)
      }, (error, doc)=>{
        if(doc == null){
          newEntity.remain_life -= runTimeSpan/1000
        }else{
          damageFacilities(doc, 300)
          newEntity.remain_life = 0
        }
      })
      if(newEntity.remain_life > 0){
        newEntities.push(newEntity)
      }
    })
    entities = newEntities
    sendEntitiesData(entities)
  }
}, runTimeSpan)

serverIO.onConnect((socket) => {
  runTime = true
  console.log('🔗a user connected!');
  socket.on("getUserData", (uuid)=>{
    usersDB.findOne({ uuid:uuid }, (error, doc) => {
      let sendUserData
      checkError(error)
      if(doc == null){
        const newUserData = {
          x:0,
          y:0,
          name:"Hello",
          direction:"down",
          handedItem:0,
          inventory: [
            {
              id:"iron_floor",
              amount:64
            },
            {
              id:"rocket_launcher",
              amount:1
            },
            {
              id:"drill",
              amount:1
            }
          ],
          uuid: uuid
        }
        usersDB.insert(newUserData, (error) => {
          if(error !== null){console.error(error);}
          console.log("👥new user added!");
          sendUserData = newUserData
        });
      }else{
        sendUserData = doc
      }
      socket.emit("playerData", sendUserData)
      sendUsersData()
      sendFloorsData()
      sendFacilitiesData()
    });
  })

  socket.on("playerDataUpdated", (playerData)=>{
    usersDB.update({ uuid:playerData.uuid }, { $set:playerData }, {}, (error)=>{
      checkError(error)
      sendUsersData()
    })
  })

  //クリック時の処理
  socket.on("tileClicked", (data)=>{
    const type = itemsData[data.id].type
    switch (type) {
      case "floor":
        floorsDB.findOne({tileX:data.x, tileY:data.y}, (error, doc)=>{
          checkError(error)
          let inputed
          if(doc == null){
            floorsDB.insert({
              tileX:data.x,
              tileY:data.y,
              id:data.id,
              hp:itemsData[data.id].hp
            }, (error)=>{
              checkError(error)
              sendFloorsData()
            })
            inputed = true
          }else{
            inputed = false
          }
          socket.emit("inputMsg", inputed)
        })
        break;

      case "facility":
        facilitiesDB.findOne({tileX:data.x, tileY:data.y}, (error, doc)=>{
          checkError(error)
          let inputed
          if(doc == null){
            facilitiesDB.insert({
              tileX:data.x,
              tileY:data.y,
              id:data.id,
              hp:itemsData[data.id].hp
            }, (error)=>{
              checkError(error)
              sendFacilitiesData()
            })
            inputed = true
          }else{
            inputed = false
          }
          socket.emit("inputMsg", inputed)
        })
        break;

      case "item":
        switch (data.id) {
          case "drill":
            facilitiesDB.findOne({tileX:data.x, tileY:data.y}, (error, doc)=>{
              checkError(error)

              if(doc != null){
                damageFacilities(doc, 50, data)

              }else{
                floorsDB.findOne({tileX:data.x, tileY:data.y}, (error, doc)=>{
                  checkError(error)
                  if(doc != null){
                    let newFloorDoc = doc
                    newFloorDoc.hp -= 50
                    if(newFloorDoc.hp <= 0){
                      floorsDB.remove({tileX:data.x, tileY:data.y}, (error)=>{
                        checkError(error)
                        sendFloorsData()
                      })
                    }else{
                      floorsDB.update({tileX:data.x, tileY:data.y}, { $set:newFloorDoc }, {}, (error)=>{
                        checkError(error)
                        sendFloorsData()
                      })
                    }
                  }
                })
              }
            })
            break;
          case "rocket_launcher":
            const bottom = data.x - data.player.x//高さ
            const height = data.y - data.player.y//底辺
            let radian = Math.atan2(height, bottom)
            entities.push({
              x: data.player.x,
              y: data.player.y,
              direction: radian,
              speed: itemsData["rocket"].speed,
              remain_life: itemsData.rocket.lifespan,
              id: "rocket"
            })
            break;

          default:
            break;
        }
        break;
      default:
        break;
    }
  })
})

serverIO.createServer(PORT)

setInterval(() => {
  const sizeLength = 6

  let usersDBsize = Math.floor(fs.statSync("./assets/users.db").size/100)/10
  usersDBsize = " ".repeat(sizeLength-usersDBsize.toString().length)+usersDBsize.toString()
  
  let facilitiesDBsize = Math.floor(fs.statSync("./assets/facilities.db").size/100)/10
  facilitiesDBsize = " ".repeat(sizeLength-facilitiesDBsize.toString().length)+facilitiesDBsize.toString()
  
  process.stdout.write(`UsersDB:${usersDBsize}KB FacilitiesDB:${facilitiesDBsize}KB\r`)
}, 1000);