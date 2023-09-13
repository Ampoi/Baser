import p5 from "p5"
import io from "socket.io-client"

import { getUID } from "./utils/getUID"
import { Floor } from "../model/Floor"
import { Entity } from "../model/Entity"
import { images } from "./utils/images"
import { drawMap } from "./draw/object/map"
import { playerPosition } from "./utils/playerPosition"
import { drawFloors } from "./draw/object/floors"
import { drawEntities } from "./draw/object/entity"
import { sendMove } from "./utils/moveKeys"
import { drawCursor } from "./draw/cursor"
import { createOnData } from "./utils/waitForData"

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

let inventorySelectIndex = 0

onData.onDataCome(fps, () => {
    new p5((p: p5) => {
        p.setup = () => {
            p.createCanvas(p.windowWidth, p.windowHeight);
            images.setUpImages(p)
            p.frameRate(fps)
        }
    
        p.draw = () => {
            p.background(0)

            playerPosition.set(entities, uid)

            drawMap(p)
            drawFloors(p, floors)
            drawEntities(p, entities)
            
            const player = entities.find((entity) => entity.id == uid)
            if( !player || player.type != "astronaut" ){ throw new Error("プレイヤーデータが見つかりません！！") }
            
            if( !player.inventory[inventorySelectIndex] ){ inventorySelectIndex = player.inventory.length - 1 }
            drawCursor(p, player.inventory[inventorySelectIndex].name )

            sendMove(socket, uid)
        }
    })
})