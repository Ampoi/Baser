import p5 from "p5";

import { tileSize } from "../../config";
import { playerPosition } from "../../utils/playerPosition";
import { images } from "../../utils/images";

export function drawObject(
    p: p5,
    x: number,
    y: number,
    size: number,
    imageName: keyof typeof images.images,
    direction: number = 1/2
){
    const entityImage = images.images[imageName]

    const [playerX, playerY] = playerPosition.get()

    const fineness = 100
    const translateX = ((Math.floor(x * fineness) / fineness) - (Math.floor(playerX * fineness) / fineness)) * tileSize + p.windowWidth  / 2
    const translateY = ((Math.floor(y * fineness) / fineness) - (Math.floor(playerY * fineness) / fineness)) * tileSize + p.windowHeight / 2

    p.translate(translateX, translateY)
    p.rotate(-(direction - 1/2) * Math.PI)
    p.imageMode("center")
    p.image(
        entityImage,
        0, 0,
        tileSize * size, tileSize * size
    )
    p.rotate((direction - 1/2) * Math.PI)
    p.translate(-translateX, -translateY)
}