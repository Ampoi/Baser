import p5 from "p5"
import { Entity } from "../../model/Entity"
import { drawCursor } from "../draw/cursor"
import { playerPosition } from "./playerPosition"
import { tileSize } from "../config"
import { Socket } from "socket.io-client"

let selectedIndex = 0
let tileDirection = 1/2

document.addEventListener("keydown", (event) => {
    switch(event.key){
        case "q":
            tileDirection = (tileDirection + 1/2) % 2
            break;
        case "e":
            tileDirection = (tileDirection - 1/2) % 2
            break;
    }
})

function getMouseTilePosition(p: p5){
    const [playerX, playerY] = playerPosition.get()

    const windowStartCornerTileX = Math.floor(playerX - (p.windowWidth / 2) / tileSize)
    const windowStartCornerTileY = Math.floor(playerY - (p.windowHeight / 2) / tileSize)

    const mouseTileX = Math.ceil(p.mouseX / tileSize) + windowStartCornerTileX
    const mouseTileY = Math.ceil(p.mouseY / tileSize) + windowStartCornerTileY

    return [mouseTileX, mouseTileY]
}

export function cursor(p: p5, uid: string, entities: Entity[]){
    const player = entities.find((entity) => entity.id == uid)
    if( !player || player.type != "astronaut" ){ throw new Error("プレイヤーデータが見つかりません！！") }

    if( !player.inventory[selectedIndex] ){ selectedIndex = player.inventory.length - 1 }
    const selectedItemName = player.inventory[selectedIndex].name

    const [mouseTileX, mouseTileY] = getMouseTilePosition(p)

    drawCursor(p, mouseTileX, mouseTileY, selectedItemName, tileDirection)
}

export function clickFunc(p: p5, socket: Socket){
    const [mouseTileX, mouseTileY] = getMouseTilePosition(p)

    socket.emit("click", {
        x: mouseTileX,
        y: mouseTileY,
        direction: tileDirection,
        selectedIndex
    })
}