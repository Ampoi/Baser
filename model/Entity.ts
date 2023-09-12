import { Item } from "./Item"

export type Entity = EntityBase & (Astronaut | ItemEntity)

type EntityBase = {
    x: number
    y: number
    id: string
}

type Astronaut = {
    type: "astronaut"
    name: string
    inventory: Item[]
}

type ItemEntity = {
    type: "item"
    name: Item["name"]
}