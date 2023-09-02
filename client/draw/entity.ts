import p5 from "p5";

import { tileSize } from "../config";

export function drawEntity(p: p5, x: number, y: number, color: string){
    p.fill(p.color(color))
    p.circle(
        tileSize * x,
        tileSize * y, 
        tileSize/3
    );
}