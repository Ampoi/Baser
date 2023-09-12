import p5 from "p5"
import { tileSize } from "../config"
import { Entity } from "../../model/Entity"
import { Images } from "../model/Images"
import { createNoise2D } from "simplex-noise"
import alea from "alea"
import { playerPosition } from "../utils/playerPosition"

const noiseScale = 20

const seed = alea("Ampoi")
const noise = createNoise2D(seed)

export const drawMap =  (p: p5, images: Images) => {
    p.noTint()

    const [playerX, playerY] = playerPosition.get()

    const windowHeightTileAmount = Math.ceil(p.windowHeight / tileSize)
    const windowWidthTileAmount = Math.ceil(p.windowWidth / tileSize)
    const windowStartCornerTileX = Math.floor((playerX - p.windowWidth/2) / tileSize)
    const windowStartCornerTileY = Math.floor((playerY - p.windowHeight/2) / tileSize)
    const wSCDifferenceX = windowStartCornerTileX*tileSize - (playerX - p.windowWidth/2)
    const wSCDifferenceY = windowStartCornerTileY*tileSize - (playerY - p.windowHeight/2)
    
    for (let iy = 0; iy < windowHeightTileAmount+1; iy++) {
        for (let ix = 0; ix < windowWidthTileAmount+1; ix++) {
            const terrainHeight = noise((ix+windowStartCornerTileX)/noiseScale, (iy+windowStartCornerTileY)/noiseScale)
            const terrainImageName = `mars_${Math.round((terrainHeight + 1) * 2) + 1}` as `mars_${1 | 2 | 3 | 4 | 5}`
            p.image(
                images[terrainImageName],
                ix*tileSize+wSCDifferenceX, iy*tileSize+wSCDifferenceY,
                tileSize, tileSize
            )
        }
    }
}