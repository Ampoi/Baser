import p5 from "p5";
import { tileSize } from "../config";
import { Direction } from "../../model/Tile";
import { getRadiusFromDirection } from "../functions/getRadiusFromDirection";

export function drawTile(p: p5, images: {[key:string]:p5.Image}, x: number, y: number, direction: Direction, color?: string){
    if( !!color ){
        p.fill(p.color(color))
        p.noStroke()
        p.rect(
            (tileSize * x) - (tileSize / 2),
            (tileSize * y) - (tileSize / 2),
            tileSize, tileSize
        )
    }else{
        p.imageMode("center")
        p.translate(tileSize * x, tileSize * y)
        p.rotate(p.radians(getRadiusFromDirection(direction)))
        p.image(
            images.conveyor,
            0, 0,
            tileSize, tileSize
        )
        p.rotate(p.radians(-getRadiusFromDirection(direction)))
        p.translate(-tileSize * x, -tileSize * y)
    }
}