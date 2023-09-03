import p5 from "p5"
import io from "socket.io-client"

import { Direction, Tile } from "../model/Tile"
import { Entity } from "../model/Entity"
import { getUID } from "./functions/getUID"
import { tileSize } from "./config"
import { drawTile } from "./draw/tile"
import { drawEntity } from "./draw/entity"
import { Images } from "../model/Image"
import { drawMap } from "./draw/map"
import { setUpImages } from "./functions/setUpImages"
import { playerPosition } from "./functions/playerPosition"

const socket = io()

let tiles: Tile[] = []
socket.on("tilesData", (newTiles: Tile[]) => tiles = newTiles)
let entities: Entity[] = []
socket.on("entitiesData", (newEntities: Entity[]) => entities = newEntities)

const uid = getUID()
socket.emit("uid", uid)

//キーボードが押されているかの判定処理
const areKeysDown = {
    w: false,
    a: false,
    s: false,
    d: false
}

const checkedKeysList = Object.keys(areKeysDown)

const setupTile: Partial<Tile> = { name: "conveyor", direction: 1 }

document.addEventListener("keydown", (event) => {
    if( checkedKeysList.includes(event.key) ){
        areKeysDown[event.key as keyof typeof areKeysDown] = true
    }else{
        switch( event.key ){
            case "q":
                setupTile.direction = ((setupTile.direction ?? 0) + 1) % 4 as Direction
                break
            case "e":
                setupTile.direction = ((setupTile.direction ?? 0) - 1) % 4 as Direction
                break
        }
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
    const [playerX, playerY] = playerPosition.get()
    return {
        x: p.mouseX / tileSize + playerX - p.windowWidth / 2 / tileSize,
        y: p.mouseY / tileSize + playerY - p.windowHeight / 2 / tileSize
    }
}

function drawCursor(p: p5){
    const {x, y} = getMouseTilePosition(p)

    drawTile(p, images, { ...Tile.create(), ...setupTile, ...{ x: Math.round(x), y: Math.round(y) } }, 0.4)
}

let images: Images

//描画関連
new p5((p: p5) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        images = setUpImages(p) as Images
    }
    
    p.draw = () => {
        drawMap(p, images)

        const player = entities.find((entity) => entity.id == uid)
        if( !player ){ throw new Error("まじ！？再起動よろしく👍") }

        playerPosition.set(player.x, player.y)

        tiles.forEach((tile) => drawTile(p, images, tile) )
    
        entities.forEach((entity) => drawEntity(p, images, entity) )

        drawCursor(p)
    }

    p.mouseClicked = () => {
        socket.emit("setUpTile", { ...Tile.create(), ...setupTile, ...{ x: getMouseTilePosition(p).x, y: getMouseTilePosition(p).y } })
    }
})