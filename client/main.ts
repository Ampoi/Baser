import p5 from "p5"
import io from "socket.io-client"
import alea from "alea"
import { createNoise2D } from "simplex-noise"

import { Direction, Tile } from "../model/Tile"
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
    return {
        x: p.mouseX / tileSize,
        y: p.mouseY / tileSize
    }
}

function drawCursor(p: p5){
    const {x, y} = getMouseTilePosition(p)

    drawTile(p, images, { ...Tile.create(), ...setupTile, ...{ x: Math.round(x), y: Math.round(y) } }, 0.4)
}

const imageNames = [
    "iron_floor",
    "conveyor",
    "mars_1",
    "mars_2",
    "mars_3",
    "mars_4",
    "mars_5",
] as const
let images: { [key in typeof imageNames[number]]?: p5.Image } = {}

const prng = alea('seed');
const noise = createNoise2D(prng)

//描画関連
new p5((p: p5) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        imageNames.forEach((name) => {
            images[name] = p.loadImage(`images/${name}.png`)
        })
    }
    
    p.draw = () => {
        const windowTileHeight = Math.ceil(p.windowHeight / tileSize)
        const windowTileWidth = Math.ceil(p.windowWidth / tileSize)
        const scale = 20

        for( let y=0; y<windowTileHeight; y++ ){
            for( let x=0; x<windowTileWidth; x++ ){
                const height = Math.round((noise(x/scale, y/scale) + 1) * 2) + 1
                drawTile(p, images, {x, y, name:`mars_${height}`, direction: 1})
            }
        }

        tiles.forEach((tile) => drawTile(p, images, tile) )
    
        entities.forEach((entity) => drawEntity(p, entity.x, entity.y, entity.color) )

        drawCursor(p)
    }

    p.mouseClicked = () => {
        socket.emit("setUpTile", { ...Tile.create(), ...setupTile, ...{ x: getMouseTilePosition(p).x, y: getMouseTilePosition(p).y } })
    }
})