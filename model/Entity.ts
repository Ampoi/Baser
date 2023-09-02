import { generateUID } from "../functions/generateUID";

export type Entity = {
    id: string;
    name: string;
    x: number;
    y: number;
    color: string;
}

export const Entity = {
    create(): Entity {
        return {
            id: generateUID(),
            name: "newSomething",
            x: 0,
            y: 0,
            color: "#00FF00"
        }
    }
}