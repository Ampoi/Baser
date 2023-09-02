export type Direction = "up" | "left" | "down" | "right"

export type Tile = {
    name: string
    x: number
    y: number
    direction: Direction
    color?: string
}

export const Tile = {
    create(): Tile {
        return {
            name: "conveyor",
            x: 0,
            y: 0,
            direction: "down",
        }
    }
}