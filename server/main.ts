import { Entity } from "../model/Entity"
import { Floor } from "../model/Floor"
import { Item } from "../model/Item"
import { server } from "./infra/server"
import { getItemType } from "./utils/getItemType"
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

const getEntity = (id: string) => {
    const entity = entities.find((entity) => entity.id == id)
    if( !entity ){ throw new Error("エンティティが見つかりませんでした！") }
    return entity
}

function move(id: string, vector: Vector){
    const entity = getEntity(id)

    entity.x += vector.x
    entity.y += vector.y
}

const getSelectedItem = (uid: string, index: number) => {
    const player = getEntity(uid)
    if( player.type != "astronaut" ){ throw new Error("プレイヤーのタイプがおかしいです！") }

    return player.inventory[index]
}

const place = (name: Item["name"], x: number, y: number, direction: number) => {
    const itemType = getItemType(name)
    if( itemType != "floor" && itemType != "facility" ){ throw new Error(`このItemは設置できません: ${name}`) }

    if( itemType == "floor" ){
        const samePositionFloor = floors.find((floor) => floor.x == x && floor.y == y)
        if( samePositionFloor ){ return false }

        console.log(direction)
        floors.push({
            name: name as Floor["name"],
            x, y, direction
        })
        return true
    }
    return false
}

server.onConnect((socket) => {
    let uid: string | undefined
    
    socket.on("uid", (sendedUid: string) => {
        initUser(sendedUid, entities)
        uid = sendedUid
    })

    socket.on("move", (pressedKeys: string[]) => {
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
        
        if( !uid ){ throw new Error("uidが空です！") }
        move(uid, vector)
    })

    socket.on("click", (data) => {
        const { x, y, direction, selectedIndex } = data

        if( !uid ){ throw new Error("uidが空です！") }
        const selectedItem = getSelectedItem(uid, selectedIndex)
        const itemType = getItemType(selectedItem.name)
        if( itemType == "floor" || itemType == "facility" ){
            const isPlaced = place(selectedItem.name, x, y, direction)
            if(  isPlaced ){
                //use(uid, selectedIndex)
            }
        }
    })
})

const tickSpeed = 60
setInterval(() => {
    server.sendData("floors", floors)
    server.sendData("entities", entities)
}, 1000 / tickSpeed)