import p5 from "p5";
import { tileSize } from "../config";
import { Direction } from "../../model/Tile";
import { getRadiusFromDirection } from "../functions/getRadiusFromDirection";

export function drawSquare(p: p5, image: p5.Image, x: number, y: number, direction: Direction, opacity?: number){
    p.noStroke()
    
    p.imageMode("center")
    if( opacity ){ p.tint(255, opacity*255) }

    p.translate(
        tileSize * x,
        tileSize * y
    )
    p.rotate(p.radians(getRadiusFromDirection(direction)))
    p.image(
        image,
        0, 0,
        tileSize, tileSize
    )
    p.rotate(p.radians(-getRadiusFromDirection(direction)))
    p.translate(-tileSize * x, -tileSize * y)
    if( opacity ){ p.tint(255,255) }
}