import p5 from "p5";
import { Floor } from "../../../model/Floor";
import { Images } from "../../model/Images";
import { drawObject } from "./index";

export function drawFloors(
    p: p5,
    floors: Floor[],
    images: Images
){
    floors.forEach((floor) => {
        drawObject(p, images, floor.x, floor.y, 1, floor.name)
    })
}