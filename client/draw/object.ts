import p5 from "p5";

import { tileSize } from "../config";
import { Images } from "../model/Images";
import { playerPosition } from "../utils/playerPosition";

export function drawObject(
    p: p5,
    images: Images,
    x:number,
    y:number,
    size:number,
    imageName: keyof Images
){
    const entityImage = images[imageName]

    const [playerX, playerY] = playerPosition.get()

    const fineness = 100
    const translateX = ((Math.floor(x * fineness) / fineness) - (Math.floor(playerX * fineness) / fineness)) * tileSize + p.windowWidth  / 2
    const translateY = ((Math.floor(y * fineness) / fineness) - (Math.floor(playerY * fineness) / fineness)) * tileSize + p.windowHeight / 2

    p.translate(translateX, translateY)
    p.imageMode("center")
    p.image(
        entityImage,
        0, 0,
        tileSize * size, tileSize * size)
    p.translate(-translateX, -translateY)
}