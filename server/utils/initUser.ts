import { Entity } from "../../model/Entity"

function hasUser(uid: string, entities: Entity[]){
    return !!entities.find((entity) => entity.id == uid)
}

function addUser(uid: string, entities: Entity[]){
    entities.push({
        id: uid,
        type: "astronaut",
        name: "Ampoi",
        x: 0,
        y: 0
    })
}

export function initUser(uid: string, entities: Entity[]){
    if( !hasUser(uid, entities) ) addUser(uid, entities)
}