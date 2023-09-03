import p5 from "p5";
import { tileSize } from "../config";
import { Tile } from "../../model/Tile";
import { getRadiusFromDirection } from "../functions/getRadiusFromDirection";
import { Images } from "../../model/Image";

export function drawTile(p: p5, images: Images, tile: Tile, opacity?: number){
    p.noStroke()
    const tileImage = images[tile.name] as p5.Image
    if( tileImage == undefined ){
        p.fill(p.color("#FF00FF"))
        p.rect(
            (tileSize * tile.x) - (tileSize / 2),
            (tileSize * tile.y) - (tileSize / 2),
            tileSize, tileSize
        )
    }else{
        p.imageMode("center")
        if( opacity ){ p.tint(255, opacity*255) }
        p.translate(tileSize * tile.x, tileSize * tile.y)
        p.rotate(p.radians(getRadiusFromDirection(tile.direction)))
        p.image(
            tileImage,
            0, 0,
            tileSize, tileSize
        )
        p.rotate(p.radians(-getRadiusFromDirection(tile.direction)))
        p.translate(-tileSize * tile.x, -tileSize * tile.y)
        if( opacity ){ p.tint(255,255) }
    }
}