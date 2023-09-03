import p5 from "p5";

import { tileSize } from "../config";
import { Entity } from "../../model/Entity";
import { Images } from "../../model/Image";
import { playerPosition } from "../functions/playerPosition";

export function drawEntity(p: p5, images: Images, entity: Entity){
    p.fill(p.color(entity.color))

    const size = (() => {
        switch(entity.type){
            case "astronaut":
                return 4
            case "item":
                return 2
            default:
                return 2
        }
    })() / 5

    const imageName = (() => {
        if( entity.type == "astronaut" ){
            return entity.type
        }else{
            return entity.name
        }
    })()

    const entityImage = images[imageName]

    const [playerX, playerY] = playerPosition.get()

    const fineness = 100
    const translateX = ((Math.round(entity.x * fineness) / fineness) - (Math.round(playerX * fineness) / fineness)) * tileSize + p.windowWidth  / 2
    const translateY = ((Math.round(entity.y * fineness) / fineness) - (Math.round(playerY * fineness) / fineness)) * tileSize + p.windowHeight / 2

    p.translate(translateX, translateY)

    p.fill(0, 80)
    p.ellipse(
        0, 0,
        tileSize * size, Math.round(tileSize * size / 3))

    const isFacingLeft = 90 < entity.rotation && entity.rotation <= 270
    if( isFacingLeft ){ p.scale(-1, 1) }

    p.imageMode("center")
    p.image(
        entityImage,
        0, 0 - (tileSize * size / 2),
        tileSize * size, tileSize * size)

    if( isFacingLeft ){ p.scale(-1, 1) }
    p.translate(-translateX, -translateY)
}