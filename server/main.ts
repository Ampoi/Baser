import { server } from "./infra/server"

import { Tile, Direction } from "../model/Tile"
import { Entity } from "../model/Entity"

const PORT = 3000
server.createServer(PORT)

const tiles: Tile[] = [
    {
        name: "conveyor",
        x: 5,
        y: 2,
        direction: 1,
        color: "#FF0000"
    },
    {
        name: "conveyor",
        x: 5,
        y: 1,
        direction: 2,
        color: "#FF0000"
    },
    {
        name: "conveyor",
        x: 4,
        y: 1,
        direction: 2,
        color: "#FF0000"
    },
    {
        name: "conveyor",
        x: 3,
        y: 1,
        direction: 3,
        color: "#FF0000"
    },
    {
        name: "conveyor",
        x: 3,
        y: 1,
        direction: 3,
        color: "#FF0000"
    },
    {
        name: "conveyor",
        x: 3,
        y: 2,
        direction: 3,
        color: "#FF0000"
    },
    {
        name: "conveyor",
        x: 3,
        y: 3,
        direction: 0,
        color: "#FF0000"
    },
    {
        name: "conveyor",
        x: 4,
        y: 3,
        direction: 0,
        color: "#FF0000"
    },
    {
        name: "conveyor",
        x: 5,
        y: 3,
        direction: 1,
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

function move(id: string, x: number, y: number){
    const entity = entities.find((entity) => entity.id == id)
    if( !entity ){ return; }

    entity.x += x
    entity.y += y
}

function summon(data: Partial<Entity>){
    const newData = {  ...Entity.create(), ...data }
    entities.push(newData)
}

function setup(type: "tile" | "facility", tile: Tile){
    const newTile = { ...Tile.create(), ...tile }
    const samePositionTile = tiles.find((value) => (value.x == newTile.x) && (value.y == newTile.y))
    if( !samePositionTile ){
        tiles.push(newTile)
    }
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

    socket.on("setUpTile", (newTile: Tile) => {
        const x = Math.round(newTile.x)
        const y = Math.round(newTile.y)
        setup("tile", { ...newTile, ...{x, y} })
    })
})

const tickSpeed = 60
setInterval(() => {
    tiles.forEach((tile) => {
        const vector = [
            Math.round(Math.cos(tile.direction / 2 * Math.PI)),
            Math.round(Math.sin(tile.direction / 2 * Math.PI))
        ]
        
        entities.forEach((entity) => {
            const conveyorSpeed = 0.5
            if((tile.x-0.5 < entity.x && entity.x <= tile.x+0.5) && (tile.y-0.5 < entity.y && entity.y <= tile.y+0.5)){
                if( tile.name == "conveyor" ){
                    entity.x += vector[0] * conveyorSpeed / tickSpeed
                    entity.y -= vector[1] * conveyorSpeed / tickSpeed
                }
            }
        })
    })
    server.sendData("tilesData", tiles)
    server.sendData("entitiesData", entities)
}, 1000 / tickSpeed)