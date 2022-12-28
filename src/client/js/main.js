import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io();

import setUUID from "./setUUID.js"
import {dock, dockTileSize, dockMargin, dockWidth} from "./dockData.js"

import drawMap from "./draw/map.js";
import drawFacilities from "./draw/facilities.js";
import drawCursor from "./draw/cursor.js"
import drawUsers from "./draw/users.js"
import drawDock from "./draw/dock.js"

//ゲーム内の設定
const tileSize = 40
const fps = 60
const walkSpeed = tileSize*3/fps

var cursorTile = {}

//UUID設定
const uuid = setUUID()
console.log(uuid);
socket.emit("getUserData",uuid)

var playerData = {
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
  ]
}

//マップ内データ
var usersData = []
var floorsData = []
var facilitiesData = []

//画像データ
let images = {}

socket.on("userData",(data)=>{
  playerData = data
})

socket.on("usersData", (data)=>{
  usersData = data
})

socket.on("floorsData", (data)=>{
  floorsData = data
})

socket.on("facilitiesData", (data)=>{
  facilitiesData = data
})

function drawGame(){
  //マップ内描画時の座標補正 (+で使いましょう)
  const setUserCenterX = -playerData.x + windowWidth/2
  const setUserCenterY = -playerData.y + windowHeight/2

  //マップ生成
  drawMap(tileSize, playerData,images)
  
  //床の描画
  drawFacilities(floorsData, images, tileSize, setUserCenterX, setUserCenterY)

  //設備の描画
  drawFacilities(facilitiesData, images, tileSize, setUserCenterX, setUserCenterY)
  
  //カーソルの描画
  cursorTile = drawCursor(setUserCenterX, setUserCenterY, tileSize, cursorTile)

  //ユーザーの描画
  drawUsers(tileSize, images, usersData, setUserCenterX, setUserCenterY)

  //座標の描画
  fill(255)
  textSize(10)
  text(
    `X:${playerData.x}, Y:${playerData.y}`,100,100
  )

  //Dockの描画
  drawDock(dock, dockTileSize, dockMargin, dockWidth, playerData)
}

window.setup = ()=>{
  createCanvas(windowWidth, windowHeight);
  noiseSeed(8)
  images.user_up = loadImage("images/user_up.png")
  images.user_down = loadImage("images/user_down.png")
  images.user_right = loadImage("images/user_right.png")
  images.user_left = loadImage("images/user_left.png")
  images.mars_1 = loadImage("images/mars_1.png")
  images.mars_2 = loadImage("images/mars_2.png")
  images.mars_3 = loadImage("images/mars_3.png")
  images.mars_4 = loadImage("images/mars_4.png")
  images.mars_5 = loadImage("images/mars_5.png")
  images.iron_floor = loadImage("images/iron_floor.png")
  images.iron_wall = loadImage("images/iron_wall.png")

  //フレームレートの設定
  frameRate(fps)
}

window.draw = ()=>{
  //キー入力の受け取り
  if(
    keyIsDown(87) ||
    keyIsDown(65) ||
    keyIsDown(83) ||
    keyIsDown(68)
  ){
    let speed = walkSpeed
    if(keyIsDown(16)){
      speed = 2*walkSpeed
    }
    if(keyIsDown(87)){ //W
      playerData.y -= speed,
      playerData.direction = "up"
    }
    if(keyIsDown(65)){ //A
      playerData.x -= speed
      playerData.direction = "left"
    }
    if(keyIsDown(83)){ //S
      playerData.y += speed
      playerData.direction = "down"
    }
    if(keyIsDown(68)){ //D
      playerData.x += speed
      playerData.direction = "right"
    }
    socket.emit("userDataUpdated", playerData)
  }
  drawGame()
}

window.mouseClicked = ()=>{
  socket.emit("tileClicked", {
    x: cursorTile.X,
    y: cursorTile.Y,
    id: playerData.inventory[playerData.handedItem].id
  })
}

window.keyTyped = ()=>{
  switch (key) {
    case "1":
      console.log("key 1 typed");
      playerData.handedItem = 0
      socket.emit("userDataUpdated", playerData)
      break;
    
    case "2":
      console.log("key 2 typed");
      playerData.handedItem = 1
      socket.emit("userDataUpdated", playerData)
      break;
    
    case "3":
      console.log("key 3 typed");
      playerData.handedItem = 2
      socket.emit("userDataUpdated", playerData)
      break;
    
    default:
      break;
  }
}