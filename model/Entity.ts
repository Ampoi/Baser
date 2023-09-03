import { generateUID } from "../functions/generateUID";

type Astronaut = {
    type: "astronaut"
    name: string
    size: 4
}

type Item = {
    type: "item"
    name: "iron"
}

type EntityBase = {
    id: string;
    name: string;
    x: number;
    y: number;
    color: string;
    rotation: number;
}

export type Entity = EntityBase & ( Astronaut | Item )

/*export const Entity = {
    create(): Entity {
        return {
            id: generateUID(),
            type: "item",
            name: "iron",
            x: 0,
            y: 0,
            color: "#00FF00"
        }
    }
}*/