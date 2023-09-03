export type Direction = 0 | 1 | 2 | 3

type TileBase  = {
    x: number
    y: number
    direction: Direction
}

type Conveyor = {
    name: "conveyor"
}

type IronFloor = {
    name: "iron_floor"
}

type Mars = {
    name: `mars_${1 | 2 | 3 | 4 | 5}`
}

export type Tile = TileBase & (Conveyor | IronFloor | Mars)

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