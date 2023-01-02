import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io();

import setUUID from "./setUUID.js"

import drawMap from "./draw/map.js";
import drawFacilities from "./draw/facilities.js";
import drawCursor from "./draw/cursor.js"
import drawUsers from "./draw/users.js"
import drawDock from "./draw/dock.js"

import {dock} from "./data/dock.js"
import itemsData from "./data/items.js"

//ゲーム内の設定
const tileSize = 40
const fps = 60
const walkSpeed = tileSize*3/fps

var cursorTile = {}

const menuWidth = 300
const menuHeight = 400
const menuBtnHeight = 60
const menuPadding = 20

var windows = {
  menu: false,
  inventory: true
}

var entities = []

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
      id:"space",
      amount:0
    },
    {
      id:"space",
      amount:0
    },
    {
      id:"space",
      amount:0
    }
  ]
}

//マップ内データ
var usersData = []
var floorsData = []
var facilitiesData = []

//画像データ
let images = {}

socket.on("playerData",(data)=>{
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

socket.on("entitiesData", (data)=>{
  entities = data
})

function move(oldPos, newPos, axis){
  const newTilePos = Math.floor(newPos/tileSize)
  const oldPlayerTilePos = Math.floor(oldPos[(axis == "x") ? "y" : "x"]/tileSize)
  const bumped = facilitiesData.some((val)=>{
    return (val[(axis == "x") ? "tileX" : "tileY"] == newTilePos && val[(axis == "x") ? "tileY" : "tileX"] == oldPlayerTilePos)
  })
  if(bumped){
    return oldPos[axis]
  }else{
    return newPos
  }
}

function drawWindow(){
  noStroke()
  fill(40)
  rect((windowWidth-menuWidth)/2,(windowHeight-menuHeight)/2,menuWidth,menuHeight,20)
}

function drawGame(){
  //マップ内描画時の座標補正 (+で使いましょう)
  const setUserCenterX = -playerData.x + windowWidth/2
  const setUserCenterY = -playerData.y + windowHeight/2

  //マップ生成
  drawMap(tileSize, playerData,images)
  
  //床の描画
  drawFacilities(floorsData, images, tileSize, setUserCenterX, setUserCenterY, itemsData)

  //設備の描画
  drawFacilities(facilitiesData, images, tileSize, setUserCenterX, setUserCenterY, itemsData)
  
  //カーソルの描画
  cursorTile = drawCursor(setUserCenterX, setUserCenterY, tileSize, cursorTile)

  //ユーザーの描画
  drawUsers(tileSize, images, usersData, setUserCenterX, setUserCenterY)

  //エンティティの描画
  entities.forEach((entity)=>{
    fill(255, 3, 3)
    rect(
      entity.x*tileSize+setUserCenterX+tileSize/2, entity.y*tileSize+setUserCenterY+tileSize/2,
      10,10
    )
  })

  //座標の描画
  fill(255)
  textSize(10)
  text(
    `X:${playerData.x}, Y:${playerData.y}`,100,100
  )

  //Dockの描画
  drawDock(dock, playerData, images)

  //メニューの描画
  if(windows.menu){
    drawWindow()
    fill(100)
    rect(
      (windowWidth-menuWidth)/2 + menuPadding, (windowHeight-menuHeight)/2 + menuPadding,
      menuWidth - menuPadding*2, menuBtnHeight,
      10
    )
    fill(255)
    textSize(18)
    text("名前を変更", windowWidth/2, (windowHeight-menuHeight)/2 + menuPadding + menuBtnHeight - 22)
  }else if(windows.inventory){
    drawWindow()
  }
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
  images.crack = loadImage("images/crack.png")
  images.drill = loadImage("images/drill.png")
  images.rocket_launcher = loadImage("images/rocket_launcher.png")

  //フレームレートの設定
  frameRate(fps)
}

window.draw = ()=>{
  if(!(windows.menu || windows.inventory)){
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
        playerData.y = move(playerData, playerData.y-speed, "y")
        playerData.direction = "up"
      }
      if(keyIsDown(65)){ //A
        playerData.x = move(playerData, playerData.x-speed, "x")
        playerData.direction = "left"
      }
      if(keyIsDown(83)){ //S
        playerData.y = move(playerData, playerData.y+speed, "y")
        playerData.direction = "down"
      }
      if(keyIsDown(68)){ //D
        playerData.x = move(playerData, playerData.x+speed, "x")
        playerData.direction = "right"
      }
      socket.emit("playerDataUpdated", playerData)
    }
  }
  drawGame()
}

window.mouseClicked = ()=>{
  if(windows.menu){
    //X座標がボタンの範囲内か
    if((windowWidth-menuWidth)/2 + menuPadding <= mouseX && mouseX <= (windowWidth-menuWidth)/2 + menuWidth - menuPadding){
      //名前を変えるボタンの範囲内か
      if((windowHeight-menuHeight)/2 + menuPadding <= mouseY && mouseY <= (windowHeight-menuHeight)/2 + menuPadding + menuBtnHeight){
        const newName = prompt("新しい名前を入力...")
        playerData.name = newName
        socket.emit("playerDataUpdated", playerData)
      }
    }
  }else{
    socket.emit("tileClicked", {
      x: cursorTile.X,
      y: cursorTile.Y,
      id: playerData.inventory[playerData.handedItem].id,
      player: {
        x:Math.floor(playerData.x/tileSize),
        y:Math.floor(playerData.y/tileSize)
      }
    })
  }
}

const numbers = /[1-3]/
window.keyTyped = ()=>{
  if(numbers.test(key)){
    const keyNumber = Number(key)
    playerData.handedItem = keyNumber-1
    socket.emit("playerDataUpdated", playerData)
  }else{
    switch (key) {
      case "e":
        windows.inventory = !windows.inventory
        break;
  
      case "p":
        windows.menu = !windows.menu
        break;
  
      default:
        break;
    }
  }
}