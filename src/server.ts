import * as fs from "fs"

import { itemsData } from "./client/js/data/items"

import { usersDB } from "./server/infra/usersDB"
import { floorsDB } from "./server/infra/floorsDB"
import { facilitiesDB } from "./server/infra/facilitiesDB"

import { sendUsersData, sendFacilitiesData, sendFloorsData, sendEntitiesData } from "./server/function/sendData"
import { checkError } from "./server/function/checkError"
import { serverIO } from "./server/infra/serverIO"

import { Entity } from "./server/model/entities"
import { Facility } from "./server/model/facilities"
import { Floor } from "./server/model/floors"
import { User } from "./server/model/user"

import { Socket } from "socket.io"

const PORT = 10323

let entities: Entity[] = []

function damageFacilities(doc: Facility, damage: number){
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
    let newEntities: Entity[] = []
    entities.forEach((entity)=>{
      let newEntity = entity

      //エンティティの移動
      newEntity.x += Math.cos(entity.direction)*entity.speed
      newEntity.y += Math.sin(entity.direction)*entity.speed
      facilitiesDB.findOne({
        tileX: Math.floor(newEntity.x),
        tileY: Math.floor(newEntity.y)
      }, (error, doc: Facility)=>{
        checkError(error)
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

serverIO.onConnect((socket: Socket) => {
  runTime = true
  console.log('🔗a user connected!');

  socket.on("getUserData", (uuid: string)=>{
    usersDB.findOne({ uuid:uuid }, (error, doc: User) => {
      checkError(error)
      let sendUserData
      if(doc == null){
        const newUserData = User.createUser(uuid)
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

  socket.on("playerDataUpdated", (playerData: User)=>{  
    usersDB.update({ uuid:playerData.uuid }, { $set:playerData }, {}, (error)=>{
      checkError(error)
      sendUsersData()
    })
  })

  type ClickData = {
    x: number,
    y: number,
    id: string,
    player: {
      x: number,
      y: number
    }
  }

  //クリック時の処理
  socket.on("tileClicked", (data: ClickData)=>{  
    const type: string = itemsData[data.id].type
    switch (type) {
      case "floor":
        floorsDB.findOne({tileX:data.x, tileY:data.y}, (error, doc: Floor)=>{
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
        facilitiesDB.findOne({tileX:data.x, tileY:data.y}, (error, doc:Facility)=>{
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
            facilitiesDB.findOne({tileX:data.x, tileY:data.y}, (error, doc:Facility)=>{
              checkError(error)

              if(doc != null){
                damageFacilities(doc, 50)

              }else{
                floorsDB.findOne({tileX:data.x, tileY:data.y}, (error, doc: Floor)=>{
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
            if(!!itemsData["rocket"].speed && !!itemsData.rocket.lifespan){
              entities.push({
                x: data.player.x,
                y: data.player.y,
                direction: radian,
                speed: itemsData["rocket"].speed,
                remain_life: itemsData.rocket.lifespan,
                id: "rocket"
              })
            }else{
              throw new Error("speed and lifespan data is required!")
            }
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

  let usersDBsize: string = `${Math.floor(fs.statSync("./assets/users.db").size/100)/10}`
  usersDBsize = " ".repeat(sizeLength-usersDBsize.toString().length)+usersDBsize.toString()
  
  let facilitiesDBsize: string = `${Math.floor(fs.statSync("./assets/facilities.db").size/100)/10}`
  facilitiesDBsize = " ".repeat(sizeLength-facilitiesDBsize.toString().length)+facilitiesDBsize.toString()
  
  process.stdout.write(`UsersDB:${usersDBsize}KB FacilitiesDB:${facilitiesDBsize}KB\r`)
}, 1000);