import p5 from "p5";
import { Tile } from "../../model/Tile";
import { Images } from "../../model/Image";
import { drawSquare } from "./square";
import { playerPosition } from "../functions/playerPosition";
import { tileSize } from "../config";

export function drawTile(p: p5, images: Images, tile: Tile, opacity?: number){
    const [playerX, playerY] = playerPosition.get()

    const windowTileX = tile.x - playerX + p.windowWidth / 2 / tileSize
    const windowTileY = tile.y - playerY + p.windowHeight / 2 / tileSize
    
    drawSquare(p, images[tile.name], windowTileX, windowTileY, tile.direction, opacity)
}