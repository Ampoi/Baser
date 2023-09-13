import p5 from "p5"
import io from "socket.io-client"

import { Entity } from "../model/Entity"
import { Floor } from "../model/Floor"

import { drawEntities } from "./draw/object/entity"
import { drawFloors } from "./draw/object/floors"
import { drawMap } from "./draw/object/map"

import { getUID } from "./utils/getUID"
import { images } from "./utils/images"
import { sendMove } from "./utils/moveKeys"
import { playerPosition } from "./utils/playerPosition"
import { createOnData } from "./utils/waitForData"
import { clickFunc, cursor } from "./utils/cursor"

const socket = io()

const uid = getUID()
socket.emit("uid", uid)

const onData = new createOnData()

let floors: Floor[] = []
socket.on("floors", (newFloors: Floor[]) => {
    if( !onData.floors ) onData.floors = true
    floors = newFloors
})

let entities: Entity[] = []
socket.on("entities", (newEntities: Entity[]) => {
    if( !onData.entities ) onData.entities = true
    entities = newEntities
})


const fps = 40

onData.onDataCome(fps, () => {
    new p5((p: p5) => {
        p.setup = () => {
            p.createCanvas(p.windowWidth, p.windowHeight);
            images.setUpImages(p)
            p.frameRate(fps)
        }
    
        p.draw = () => {
            p.background(0)

            playerPosition.set(entities, uid) //描画の時に使う

            drawMap(p)
            drawFloors(p, floors)
            drawEntities(p, entities)
            cursor(p, uid, entities)

            sendMove(socket)
        }

        p.mouseClicked = (_event) => clickFunc(p, socket)
    })
})