import { io } from "socket.io-client";
import p5 from "p5";

import { setUUID } from "./func/setUUID"
import { drawMap } from "./draw/map";

const socket = io();
const fps = 60

const uuid = setUUID()

socket.emit("userLogined", uuid)

const map = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

export type Images = {
  [key: string]: p5.Image
}
let images : Images = {}
let imageNames = ["mars_1", "mars_2", "mars_3", "mars_4", "mars_5"]

const sketch = (p: p5) => {
  p.setup = async ()=>{
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    canvas.id("gameView")
    p.frameRate(fps)

    imageNames.forEach((imageName: string)=>{
      images[imageName] = p.loadImage(`images/${imageName}.png`)
    })
  }
  
  p.draw = ()=>{
    p.background("#E12FF0")
    drawMap(p, map, images)
  }
}

new p5(sketch)