import p5 from "p5"
import io from "socket.io-client"

import { getUID } from "./utils/getUID"
import { Floor } from "../model/Floor"
import { Entity } from "../model/Entity"
import { Images } from "./model/Images"
import { setUpImages } from "./utils/setupImages"
import { drawMap } from "./draw/map"
import { playerPosition } from "./utils/playerPosition"
import { drawFloors } from "./draw/floors"
import { drawEntities } from "./draw/entity"

const socket = io()

const uid = getUID()
socket.emit("uid", uid)

const isLoaded = {
    floors: false,
    entities: false
}

let floors: Floor[] = []
socket.on("floors", (newFloors: Floor[]) => {
    if( !isLoaded.floors ) isLoaded.floors = true
    floors = newFloors
})

let entities: Entity[] = []
socket.on("entities", (newEntities: Entity[]) => {
    if( !isLoaded.entities ) isLoaded.entities = true
    entities = newEntities
})

let images: Images
const fps = 40

new Promise<void>((resolve) => {
    const waitInterval = setInterval(() => {
        if( isLoaded.floors && isLoaded.entities ){
            clearInterval(waitInterval)
            resolve()
        }
    }, 1000 / 40)
}).then(() => {
    new p5((p: p5) => {
        p.setup = () => {
            p.createCanvas(p.windowWidth, p.windowHeight);
            images = setUpImages(p) as Images
            p.frameRate(fps)
        }
    
        p.draw = () => {
            p.background(0)

            playerPosition.set(entities, uid)

            drawMap(p, images)
            drawFloors(p, floors, images)
            drawEntities(p, entities, images)
        }
    })
})