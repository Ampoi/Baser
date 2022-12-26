const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = 3000

app.get('/', (req, res) => {res.sendFile(`${__dirname}/client/index.html`)});
app.get('/p5.min.js', (req, res) => {res.sendFile(`${__dirname}/client/p5.min.js`)});
app.get('/images/user_down.png', (req, res) => {res.sendFile(`${__dirname}/client/images/user_down.png`)});
app.get('/images/user_left.png', (req, res) => {res.sendFile(`${__dirname}/client/images/user_left.png`)});
app.get('/images/user_right.png', (req, res) => {res.sendFile(`${__dirname}/client/images/user_right.png`)});
app.get('/images/user_up.png', (req, res) => {res.sendFile(`${__dirname}/client/images/user_up.png`)});
app.get('/images/mars_1.png', (req, res) => {res.sendFile(`${__dirname}/client/images/mars_1.png`)});
app.get('/images/mars_2.png', (req, res) => {res.sendFile(`${__dirname}/client/images/mars_2.png`)});
app.get('/images/mars_3.png', (req, res) => {res.sendFile(`${__dirname}/client/images/mars_3.png`)});
app.get('/images/mars_4.png', (req, res) => {res.sendFile(`${__dirname}/client/images/mars_4.png`)});
app.get('/images/mars_5.png', (req, res) => {res.sendFile(`${__dirname}/client/images/mars_5.png`)});
app.get('/images/iron_floor.png', (req, res) => {res.sendFile(`${__dirname}/client/images/iron_floor.png`)});

const Database = require("nedb");
//ユーザーデータベースと接続
const usersDB = new Database({ filename: "./assets/users.db" });
usersDB.loadDatabase((error) => {
  if(error !== null){console.error(error);}
  console.log("📁Loaded UsersDatabase compeleted");
});
//設備データベースと接続
const facilitiesDB = new Database({ filename: "./assets/facilities.db" });
facilitiesDB.loadDatabase((error) => {
  if(error !== null){console.error(error);}
  console.log("📁Loaded FacilitiesDatabase compeleted");
});

function sendUsersData(){
  usersDB.find({}, (err, docs)=>{
    if(err != null){console.error(err);}
    io.emit("usersData", docs)
  })
}
function sendFacilitiesData(){
  facilitiesDB.find({}, (err, docs)=>{
    if(err != null){console.error(err);}
    io.emit("facilitiesData", docs)
  })
}
function checkError(err){
  if(err != null){console.error(err);}
}

io.on('connection', (socket) => {
  console.log('🔗a user connected!');
  socket.on("getUserData", (uuid)=>{
    usersDB.findOne({ uuid:uuid }, (error, doc) => {
      let sendUserData
      checkError(error)
      if(doc == null){
        const newUserData = {
          name:"apapa",
          x:30,
          y:10,
          uuid:uuid
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
      sendFacilitiesData()
    });
  })

  socket.on("userDataUpdated", (userData)=>{
    usersDB.update({ uuid:userData.uuid }, userData, {}, (error, docNum)=>{
      checkError(error)
      sendUsersData()
    })
  })

  socket.on("tileClicked", (data)=>{
    if(data.type == "facilities"){
      facilitiesDB.findOne({tileX:data.x, tileY:data.y}, (error, doc)=>{
        checkError(error)
        let inputed
        if(doc == null){
          facilitiesDB.insert({
            tileX:data.x,
            tileY:data.y,
            id:data.id
          }, (error)=>{
            console.log("input facilities!!");
            checkError(error)
            sendFacilitiesData()
          })
          inputed = true
        }else{
          inputed = false
        }
        socket.emit("inputMsg", inputed)
      })
    }
  })
});

server.listen(PORT, () => {
  console.log(`📡server is running on PORT:${PORT}`);
});