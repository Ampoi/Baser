export type Direction = "up" | "left" | "down" | "right"

export type Tile = {
    name: string
    x: number
    y: number
    direction: Direction
    speed: number
    color: string
}