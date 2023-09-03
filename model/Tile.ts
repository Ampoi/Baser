export type Direction = 0 | 1 | 2 | 3

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
            direction: 3
        }
    }
}