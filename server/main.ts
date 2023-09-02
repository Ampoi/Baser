import { server } from "./infra/server"

import { Tile, Direction } from "../model/Tile"
import { Entity } from "../model/Entity"

const PORT = 3000
server.createServer(PORT)

const tiles: Tile[] = [
    {
        name: "ベルトコンベア",
        x: 5,
        y: 2,
        direction: "up",
        speed: 0.5,
        color: "#FF0000"
    },
    {
        name: "ベルトコンベア",
        x: 5,
        y: 1,
        direction: "left",
        speed: 0.5,
        color: "#FF0000"
    },
    {
        name: "ベルトコンベア",
        x: 4,
        y: 1,
        direction: "left",
        speed: 0.5,
        color: "#FF0000"
    },
    {
        name: "ベルトコンベア",
        x: 3,
        y: 1,
        direction: "down",
        speed: 0.5,
        color: "#FF0000"
    },
    {
        name: "ベルトコンベア",
        x: 3,
        y: 1,
        direction: "down",
        speed: 0.5,
        color: "#FF0000"
    },
    {
        name: "ベルトコンベア",
        x: 3,
        y: 2,
        direction: "down",
        speed: 0.5,
        color: "#FF0000"
    },
    {
        name: "ベルトコンベア",
        x: 3,
        y: 3,
        direction: "right",
        speed: 0.5,
        color: "#FF0000"
    },
    {
        name: "ベルトコンベア",
        x: 4,
        y: 3,
        direction: "right",
        speed: 0.5,
        color: "#FF0000"
    },
    {
        name: "ベルトコンベア",
        x: 5,
        y: 3,
        direction: "up",
        speed: 0.5,
        color: "#FF0000"
    }
]

const entities: Entity[] = [
    {
        name: "a",
        id: "1",
        x: 5.5,
        y: 2.4,
        color: "#FF0000"
    },
    {
        name: "a",
        id: "2",
        x: 5.1,
        y: 2.2,
        color: "#FF0000"
    },
    {
        name: "a",
        id: "3",
        x: 5.4,
        y: 2.7,
        color: "#FF0000"
    }
]

function getDirectionVector(direction: Direction){
    switch (direction){
        case "up":
            return [0, -1]
        case "left":
            return [-1, 0]
        case "down":
            return [0, 1]
        case "right":
            return [1, 0]
    }
}

function move(id: string, x: number, y: number){
    const entity = entities.find((entity) => entity.id == id)
    if( !entity ){ console.log("⚠️エンティティが見つかりませんでした"); return; }

    entity.x += x
    entity.y += y
}

function summon(data: Partial<Entity>){
    const newData = {  ...Entity.create(), ...data }
    entities.push(newData)
}

server.onConnect((socket) => {
    socket.on("uid", (uid: string) => {
        if( !entities.find((entity) => entity.id == uid) ){
            summon({
                name: "Ampoi",
                id: uid,
                x: 6,
                y: 6,
                color: "#0f0"
            })
        }
    })

    socket.on("isMoving", (uid: string, keys: string[]) => {
        let x = 0
        let y = 0

        const walkSpeed = 4 / tickSpeed
        keys.forEach((key) => {
            switch(key){
                case "w":
                    y -= walkSpeed
                    return;
                case "a":
                    x -= walkSpeed
                    return;
                case "s":
                    y += walkSpeed
                    return;
                case "d":
                    x += walkSpeed
                    return;
            }
        })

        move(uid, x, y)
    })
})

const tickSpeed = 60
setInterval(() => {
    tiles.forEach((tile) => {
        if( tile.name == "ベルトコンベア" ){
            const vector = getDirectionVector(tile.direction)
            entities.forEach((entity) => {
                if((tile.x-0.5 < entity.x && entity.x <= tile.x+0.5) && (tile.y-0.5 < entity.y && entity.y <= tile.y+0.5)){
                    entity.x += vector[0] * tile.speed / tickSpeed
                    entity.y += vector[1] * tile.speed / tickSpeed
                }
            })
        }
    })
    server.sendData("tilesData", tiles)
    server.sendData("entitiesData", entities)
}, 1000 / tickSpeed)