import p5 from "p5"
import { drawObject } from "./object/index"
import { images } from "../utils/images"

export const drawCursor =  (p: p5, x:number, y:number, imageName: keyof typeof images.images, direction: number) => {
    p.tint(255, 100)
    drawObject(p, x, y, 1, imageName, direction)
    p.noTint()
}