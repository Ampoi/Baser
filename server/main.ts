import { Entity } from "../model/Entity"
import { Floor } from "../model/Floor"
import { server } from "./infra/server"
import { initUser } from "./utils/initUser"
import { Vector } from "./utils/vector"

const PORT = 3000
server.createServer(PORT)

const floors: Floor[] = [{
    name: "conveyor",
    x: 0,
    y: 0,
    direction: 0
}]
const entities: Entity[] = []

const moveSpeed = 0.2

function move(id: string, vector: Vector){
    const entity = entities.find((entity) => entity.id == id)
    if( !entity ){ throw new Error("エンティティが見つかりませんでした！") }

    entity.x += vector.x
    entity.y += vector.y
}

server.onConnect((socket) => {
    socket.on("uid", (uid: string) => initUser(uid, entities))
    socket.on("move", (uid: string, pressedKeys: string[]) => {
        const vector = new Vector(0, 0)

        pressedKeys.forEach((key) => {
            switch(key){
                case "w":
                    vector.y -= 1
                    break;
                case "a":
                    vector.x -= 1
                    break;
                case "s":
                    vector.y += 1
                    break;
                case "d":
                    vector.x += 1
                    break;
            }
        })

        const directionDistance = Math.round(Math.sqrt((vector.x ** 2) + (vector.y ** 2)))
        if( directionDistance == 0 ){ return; }
        vector.mult(moveSpeed / directionDistance)
        move(uid, vector)
    })
})

const tickSpeed = 60
setInterval(() => {
    server.sendData("floors", floors)
    server.sendData("entities", entities)
}, 1000 / tickSpeed)