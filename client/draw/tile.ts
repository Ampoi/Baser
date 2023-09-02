import p5 from "p5";
import { tileSize } from "../config";
import { Direction, Tile } from "../../model/Tile";
import { getRadiusFromDirection } from "../functions/getRadiusFromDirection";

export function drawTile(p: p5, images: {[key:string]:p5.Image}, tile: Tile){
    if( images[tile.name] == undefined ){
        p.fill(p.color("#FF00FF"))
        p.noStroke()
        p.rect(
            (tileSize * tile.x) - (tileSize / 2),
            (tileSize * tile.y) - (tileSize / 2),
            tileSize, tileSize
        )
    }else{
        p.imageMode("center")
        p.translate(tileSize * tile.x, tileSize * tile.y)
        p.rotate(p.radians(getRadiusFromDirection(tile.direction)))
        p.image(
            images[tile.name],
            0, 0,
            tileSize, tileSize
        )
        p.rotate(p.radians(-getRadiusFromDirection(tile.direction)))
        p.translate(-tileSize * tile.x, -tileSize * tile.y)
    }
}