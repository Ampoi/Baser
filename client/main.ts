import p5 from "p5"
import io from "socket.io-client"

import { Tile } from "../model/Tile"
import { Entity } from "../model/Entity"
import { getUID } from "./functions/getUID"
import { tileSize } from "./config"
import { drawTile } from "./draw/tile"
import { drawEntity } from "./draw/entity"

const socket = io()

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

function getMouseTilePosition(p: p5){
    return {
        x: p.mouseX / tileSize,
        y: p.mouseY / tileSize
    }
}

function drawCursor(p: p5){
    const {x, y} = getMouseTilePosition(p)

    drawTile(p, Math.round(x), Math.round(y), "#FFFFFF70")
}

//描画関連
new p5((p: p5) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
    }
    
    p.draw = () => {
        p.background("#EB7E5A");
    
        tiles.forEach((tile) => drawTile(p, tile.x, tile.y, tile.color) )
    
        entities.forEach((entity) => drawEntity(p, entity.x, entity.y, entity.color) )

        drawCursor(p)
    }
})