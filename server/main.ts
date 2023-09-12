import { Entity } from "../model/Entity"
import { Floor } from "../model/Floor"
import { server } from "./infra/server"
import { initUser } from "./utils/initUser"

const PORT = 3000
server.createServer(PORT)

const floors: Floor[] = [{
    name: "conveyor",
    x: 0,
    y: 0,
    direction: 0
}]
const entities: Entity[] = []

server.onConnect((socket) => {
    socket.on("uid", (uid: string) => initUser(uid, entities))
})

const tickSpeed = 60
setInterval(() => {
    server.sendData("floors", floors)
    server.sendData("entities", entities)
}, 1000 / tickSpeed)