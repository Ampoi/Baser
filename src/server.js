const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require("fs")

const PORT = 10323

const items = {
  "iron_floor":{
    name:"鉄床",
    type:"floor"
  },
  "iron_wall":{
    name:"鉄壁",
    type:"facility"
  },
  "drill":{
    name:"ドリル",
    type:"item"
  }
}

function checkError(err){
  if(err != null){console.error(err);}
}

app.get("*", (req, res) => {
  res.sendFile(`${__dirname}/client${req.url}`);
});

const Database = require("nedb");

//ユーザーデータベースと接続
const usersDB = new Database({ filename: "./assets/users.db" });
usersDB.loadDatabase((error) => {
  checkError(error)
  console.log("📁Loaded UsersDatabase compeleted");
});

//床データベースと接続
const floorsDB = new Database({ filename: "./assets/floors.db" });
floorsDB.loadDatabase((error) => {
  checkError(error)
  console.log("📁Loaded FloorsDatabase compeleted");
});

//設備データベースと接続
const facilitiesDB = new Database({ filename: "./assets/facilities.db" });
facilitiesDB.loadDatabase((error) => {
  checkError(error)
  console.log("📁Loaded FacilitiesDatabase compeleted");
});

function sendUsersData(){
  usersDB.find({}, (err, docs)=>{
    checkError(err)
    io.emit("usersData", docs)
  })
}

function sendFacilitiesData(){
  facilitiesDB.find({}, (err, docs)=>{
    checkError(err)
    io.emit("facilitiesData", docs)
  })
}

function sendFloorsData(){
  floorsDB.find({}, (err, docs)=>{
    checkError(err)
    io.emit("floorsData", docs)
  })
}

io.on('connection', (socket) => {
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
              id:"iron_wall",
              amount:64
            },
            {
              id:"drill",
              amount:1
            }
          ],
          uuid: uuid
        }
        usersDB.insert(newUserData, (error, newDoc) => {
          if(error !== null){console.error(error);}
          console.log("👥new user added!");
          sendUserData = newUserData
        });
      }else{
        sendUserData = doc
      }
      socket.emit("userData", sendUserData)
      sendUsersData()
      sendFloorsData()
      sendFacilitiesData()
    });
  })

  socket.on("userDataUpdated", (userData)=>{
    usersDB.update({ uuid:userData.uuid }, userData, {}, (error, docNum)=>{
      checkError(error)
      sendUsersData()
    })
  })

  //クリック時の処理
  socket.on("tileClicked", (data)=>{
    console.log(data.id);
    const type = items[data.id].type
    switch (type) {
      case "floor":
        floorsDB.findOne({tileX:data.x, tileY:data.y}, (error, doc)=>{
          checkError(error)
          let inputed
          if(doc == null){
            floorsDB.insert({
              tileX:data.x,
              tileY:data.y,
              id:data.id
            }, (error)=>{
              console.log("input floor!!");
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
              id:data.id
            }, (error)=>{
              console.log("input facility!!");
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
        console.log("use item");
        break;
      default:
        break;
    }
    if(type == "floor"){
      
    }
  })
});

server.listen(PORT, () => {
  console.log(`📡server is running on PORT:${PORT}`);
});

setInterval(() => {
  const sizeLength = 6

  let usersDBsize = Math.floor(fs.statSync("./assets/users.db").size/100)/10
  usersDBsize = " ".repeat(sizeLength-usersDBsize.toString().length)+usersDBsize.toString()
  
  let facilitiesDBsize = Math.floor(fs.statSync("./assets/facilities.db").size/100)/10
  facilitiesDBsize = " ".repeat(sizeLength-facilitiesDBsize.toString().length)+facilitiesDBsize.toString()
  
  process.stdout.write(`UsersDB:${usersDBsize}KB FacilitiesDB:${facilitiesDBsize}KB\r`)
}, 1000);