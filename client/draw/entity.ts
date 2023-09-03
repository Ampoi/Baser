import p5 from "p5";

import { tileSize } from "../config";
import { Entity } from "../../model/Entity";
import { Images } from "../../model/Image";

export function drawEntity(p: p5, images: Images, entity: Entity){
    p.fill(p.color(entity.color))

    const size = (() => {
        switch(entity.type){
            case "astronaut":
                return 3
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

    p.fill(0, 80)
    p.ellipse(
        entity.x * tileSize,
        entity.y * tileSize,
        tileSize * size, Math.round(tileSize * size / 3))
    
    p.imageMode("center")
    p.image(
        entityImage,
        entity.x * tileSize,
        entity.y * tileSize - (tileSize * size / 2),
        tileSize * size, tileSize * size)
}