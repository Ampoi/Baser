import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io();

import setUUID from "./setUUID.js"
import {dock, dockTileSize, dockMargin, dockWidth} from "./dockData.js"
import drawMap from "./drawMap.js";

//ゲーム内の設定
const tileSize = 40
const fps = 60
const walkSpeed = tileSize*3/fps
const light = 0

let itemInHandId
let playerTilePosition

var cursorTileX
var cursorTileY

//UUID設定
const uuid = setUUID()
socket.emit("getUserData",uuid)

var playerData = {
  x:0,
  y:0,
  name:"",
  direction:"down"
}

//マップ内データ
var usersData = []
var facilitiesData = []

//画像データ
let user_up
let user_down
let user_right
let user_left

let mars_1
let mars_2
let mars_3
let mars_4
let mars_5

let iron_floor

socket.on("userData",(data)=>{
  playerData = data
})

socket.on("usersData", (data)=>{
  usersData = data
})

socket.on("facilitiesData", (data)=>{
  facilitiesData = data
})

function drawGame(){
  //マップ内描画時の座標補正 (+で使いましょう)
  const setUserCenterX = -playerData.x + windowWidth/2
  const setUserCenterY = -playerData.y + windowHeight/2

  //マップ生成
  drawMap(tileSize, playerData, mars_1, mars_2, mars_3, mars_4, mars_5)

  //設備の描画
  facilitiesData.forEach(facilityData => {
    switch (facilityData.id) {
      case "iron_floor":
        stroke(0)
        strokeWeight(0.5)
        image(
          iron_floor,
          facilityData.tileX*tileSize+setUserCenterX, facilityData.tileY *tileSize+setUserCenterY,
          tileSize, tileSize
        )            
        break;
      default:
        fill("#FF01FF")
        rect(
          facilityData.tileX*tileSize+setUserCenterX, facilityData.tileY*tileSize+setUserCenterX,
          tileSize, tileSize
        )
        break;
    }
  })

  //カーソルの描画
  cursorTileX = Math.floor((mouseX-setUserCenterX)/tileSize)
  cursorTileY = Math.floor((mouseY-setUserCenterY)/tileSize)
  fill(255, 255, 255, 100)
  rect(cursorTileX*tileSize+setUserCenterX, cursorTileY*tileSize+setUserCenterY, tileSize, tileSize)

  //ユーザーの描画
  usersData.forEach(userData => {
    let userImage
    switch (userData.direction) {
      case "up":
        userImage = user_up
        break;
      case "down":
        userImage = user_down
        break;
      case "left":
        userImage = user_left
        break;
      case "right":
        userImage = user_right
        break;
      default:
        userImage = user_down
        break;
    }
    image(
      userImage,
      userData.x - tileSize/2 + setUserCenterX, userData.y - tileSize/2 + setUserCenterY,
      tileSize, tileSize
    )
  });

  //座標の描画
  fill(255)
  textSize(10)
  text(
    `X:${playerData.x}, Y:${playerData.y}`,100,100
  )

  //Dockの描画
  fill(40)
  rect(
    (windowWidth-dockWidth)/2 - dockMargin,
    windowHeight-10-dockTileSize - dockMargin*2,
    dockWidth,
    dockTileSize + dockMargin*2
  )
  
  //Dock内のボタンの描画
  let counter = 0
  dock.forEach(button => {
    noStroke()
    fill(100)
    rect(
      (windowWidth-dockWidth)/2+counter*(dockTileSize+dockMargin),
      windowHeight-10-dockTileSize - dockMargin,
      dockTileSize, dockTileSize,
      dockTileSize/8
    )
    textSize(dockTileSize/4)
    textAlign(CENTER)
    fill(255)
    text(
      button.key,
      (windowWidth-dockWidth)/2+counter*(dockTileSize+dockMargin)+dockTileSize/2,
      windowHeight-10-dockMargin-dockTileSize/10
    )
    counter += 1
  })//Dock内UIの描画
}

window.setup = ()=>{
  createCanvas(windowWidth, windowHeight);
  noiseSeed(8)
  user_up = loadImage("images/user_up.png")
  user_down = loadImage("images/user_down.png")
  user_right = loadImage("images/user_right.png")
  user_left = loadImage("images/user_left.png")
  mars_1 = loadImage("images/mars_1.png")
  mars_2 = loadImage("images/mars_2.png")
  mars_3 = loadImage("images/mars_3.png")
  mars_4 = loadImage("images/mars_4.png")
  mars_5 = loadImage("images/mars_5.png")
  iron_floor = loadImage("images/iron_floor.png")

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
    x:cursorTileX,
    y:cursorTileY,
    id:"iron_floor",
    type:"facilities"
  })
}