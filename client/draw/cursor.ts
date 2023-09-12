import p5 from "p5"
import { tileSize } from "../config"
import { Images } from "../model/Images"
import { playerPosition } from "../utils/playerPosition"
import { drawObject } from "./object/index"

export const drawCursor =  (p: p5, images: Images, imageName: keyof Images) => {
    p.tint(255, 100)
    const [playerX, playerY] = playerPosition.get()

    const windowStartCornerTileX = Math.floor(playerX - (p.windowWidth / 2) / tileSize)
    const windowStartCornerTileY = Math.floor(playerY - (p.windowHeight / 2) / tileSize)
    
    const mouseTileX = Math.ceil(p.mouseX / tileSize)
    const mouseTileY = Math.ceil(p.mouseY / tileSize)
    
    drawObject(p, images, mouseTileX + windowStartCornerTileX, mouseTileY + windowStartCornerTileY, 1, imageName)
    p.noTint()
}