import p5 from "p5"
import { Entity } from "../../model/Entity"
import { drawCursor } from "../draw/cursor"

let selectedIndex = 0
let tileDirection = 1/2

document.addEventListener("keydown", (event) => {
    switch(event.key){
        case "q":
            tileDirection = (tileDirection + 1/2) % 2
            break;
        case "e":
            tileDirection = (tileDirection - 1/2) % 2
            break;
    }
})

export function cursor(p: p5, uid: string, entities: Entity[]){
    const player = entities.find((entity) => entity.id == uid)
    if( !player || player.type != "astronaut" ){ throw new Error("プレイヤーデータが見つかりません！！") }

    if( !player.inventory[selectedIndex] ){ selectedIndex = player.inventory.length - 1 }
    const selectedItemName = player.inventory[selectedIndex].name
    drawCursor(p, selectedItemName, tileDirection)
}