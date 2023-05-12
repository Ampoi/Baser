import { io } from "socket.io-client";
import p5 from "p5";

import { setUUID } from "./func/setUUID"

const socket = io();
const fps = 60

const uuid = setUUID()

socket.emit("userLogined", uuid)

const sketch =  (p: p5) => {
  p.setup = ()=>{
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.frameRate(fps)
  }
  
  p.draw = ()=>{
    p.background(0)
    p.rect(20, 20, 40, 40)
  }
}

new p5(sketch)