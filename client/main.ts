import p5 from "p5"
import io from "socket.io-client"

import { Tile } from "../model/Tile"
import { Entity } from "../model/Entity"
import { getUID } from "./functions/getUID"

const socket = io()

const tileSize = 40
let tiles: Tile[] = []
socket.on("tilesData", (newTiles: Tile[]) => tiles = newTiles)
let entities: Entity[] = []
socket.on("entitiesData", (newEntities: Entity[]) => entities = newEntities)

const uid = getUID()
socket.emit("uid", uid)

const areKeysDown = {
    w: false,
    a: false,
    s: false,
    d: false
}

const checkedKeysList = Object.keys(areKeysDown)

document.addEventListener("keydown", (event) => {
    if( checkedKeysList.includes(event.key) ){
        areKeysDown[event.key as keyof typeof areKeysDown] = true
    }
})

document.addEventListener("keyup", (event) => {
    if( checkedKeysList.includes(event.key) ){
        areKeysDown[event.key as keyof typeof areKeysDown] = false
    }
})

const tickSpeed = 60
setInterval(() => {
    const sendKeys = Object.entries(areKeysDown).map((data) => {
        const [key, isDown] = data as [keyof typeof areKeysDown, boolean]
        if( isDown ){ return key }
    }).filter((value) => !!value)

    if( sendKeys.length > 0 ){
        socket.emit("isMoving", uid, sendKeys)
    }
}, 1000 / tickSpeed)

//描画関連
new p5((p: p5) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
    }
    
    p.draw = () => {
        p.background(220);
    
        tiles.forEach((tile) => {
            p.fill(p.color(tile.color))
            p.rect(tileSize*tile.x - tileSize/2, tileSize*tile.y - tileSize/2, tileSize, tileSize);
        })
    
        entities.forEach((entity) => {
            p.fill(p.color(entity.color))
            p.circle(tileSize*entity.x, tileSize*entity.y, tileSize/3);
        })
    }
})