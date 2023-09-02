import { Direction } from "../../model/Tile";

export function getRadiusFromDirection(direction: Direction): number {
    let radius: number
    switch( direction ){
        case "up":
            radius = 0
            break
        case "left":
            radius = 270
            break
        case "down":
            radius = 180
            break
        case "right":
            radius = 90
            break
    }
    return radius
}