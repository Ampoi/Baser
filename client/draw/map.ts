import p5 from "p5"
import alea from "alea"
import { createNoise2D } from "simplex-noise"

import { tileSize } from "../config"
import { Images } from "../../model/Image"
import { drawSquare } from "./square"
import { playerPosition } from "../functions/playerPosition"

const prng = alea('seed');
const noise = createNoise2D(prng)

export function drawMap(p: p5, images: Images){
    const windowTileHeight = Math.ceil(p.windowHeight / tileSize)
    const windowTileWidth = Math.ceil(p.windowWidth / tileSize)

    const [playerX, playerY] = playerPosition.get()

    const scale = 20

    for( let y=0; y<windowTileHeight; y++ ){
        for( let x=0; x<windowTileWidth; x++ ){
            const windowTileX = x + Math.floor(playerX) + 2
            const windowTileY = y + Math.floor(playerY) + 2
            const cornerDiffX = playerX % 1 + 1/2 + 1/3
            const cornerDiffY = playerY % 1 + 1/2

            const height = Math.round((noise(
                windowTileX / scale,
                windowTileY / scale
            ) + 1) * 2) + 1 as 1 | 2 | 3 | 4 | 5
            drawSquare(
                p, images[`mars_${height}`],
                x - cornerDiffX,
                y - cornerDiffY,
                1
            )
        }
    }
}