import p5 from "p5";
import { Floor } from "../../../model/Floor";
import { drawObject } from "./index";

export function drawFloors(
    p: p5,
    floors: Floor[]
){
    floors.forEach((floor) => {
        drawObject(p, floor.x, floor.y, 1, floor.name)
    })
}