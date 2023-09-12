import p5 from "p5";
import { Images } from "../model/Images";
import { drawObject } from "./object";
import { Entity } from "../../model/Entity";

export function drawEntities(
    p: p5,
    entities: Entity[],
    images: Images
){
    entities.forEach((entity) => {
        const size = (() => {
            switch(entity.type){
                case "astronaut":
                    return 4
                case "item":
                    return 2
            }
        })()/5

        const imageName = (() => {
            if(entity.type == "astronaut"){
                return entity.type
            }else{
                return entity.name
            }
        })()

        drawObject(p, images, entity.x, entity.y, size, imageName)
    })
}