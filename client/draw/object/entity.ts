import p5 from "p5";
import { drawObject } from "./index";
import { Entity } from "../../../model/Entity";

export function drawEntities(
    p: p5,
    entities: Entity[]
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

        drawObject(p, entity.x, entity.y, size, imageName)
    })
}