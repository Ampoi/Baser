import p5 from "p5"
import alea from "alea"
import { createNoise2D } from "simplex-noise"

import { drawTile } from "./tile"
import { tileSize } from "../config"
import { Images } from "../../model/Image"

const prng = alea('seed');
const noise = createNoise2D(prng)

export function drawMap(p: p5, images: Images){
    const windowTileHeight = Math.ceil(p.windowHeight / tileSize)
    const windowTileWidth = Math.ceil(p.windowWidth / tileSize)
    const scale = 20
    
    for( let y=0; y<windowTileHeight; y++ ){
        for( let x=0; x<windowTileWidth; x++ ){
            const height = Math.round((noise(x/scale, y/scale) + 1) * 2) + 1 as 1 | 2 | 3 | 4 | 5
            drawTile(p, images, {x, y, name:`mars_${height}`, direction: 1})
        }
    }
}