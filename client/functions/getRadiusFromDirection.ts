import { Direction } from "../../model/Tile";

export function getRadiusFromDirection(direction: Direction): number {
    let radius: number = -90 * direction + 90
    return radius
}