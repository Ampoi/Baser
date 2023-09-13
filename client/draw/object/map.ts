import p5 from "p5"
import { tileSize } from "../../config"
import { createNoise2D } from "simplex-noise"
import alea from "alea"
import { playerPosition } from "../../utils/playerPosition"
import { drawObject } from "./index"

const noiseScale = 20

const seed = alea("Ampoi")
const noise = createNoise2D(seed)

export const drawMap =  (p: p5) => {
    const [playerX, playerY] = playerPosition.get()

    const windowStartCornerTileX = Math.floor(playerX - (p.windowWidth / 2) / tileSize)
    const windowStartCornerTileY = Math.floor(playerY - (p.windowHeight / 2) / tileSize)
    
    const windowTileHeight = Math.ceil(p.windowHeight / tileSize) + 2
    const windowTileWidth = Math.ceil(p.windowWidth / tileSize) + 2
    
    for (let iy = 0; iy < windowTileHeight; iy++) {
        for (let ix = 0; ix < windowTileWidth; ix++) {
            const terrainHeight = noise((ix+windowStartCornerTileX)/noiseScale, (iy+windowStartCornerTileY)/noiseScale)
            const terrainImageName = `mars_${Math.round((terrainHeight + 1) * 2) + 1}` as `mars_${1 | 2 | 3 | 4 | 5}`

            drawObject(p, ix + windowStartCornerTileX, iy + windowStartCornerTileY, 1, terrainImageName)
        }
    }
}