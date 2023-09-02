import p5 from "p5";
import { tileSize } from "../config";

export function drawTile(p: p5, x: number, y: number, color: string){
    p.fill(p.color(color))
    p.noStroke()
    p.rect(
        (tileSize * x) - (tileSize / 2),
        (tileSize * y) - (tileSize / 2),
        tileSize, tileSize
    );
}