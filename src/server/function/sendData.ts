import { checkError } from "./checkError"
import { serverIO } from "../infra/serverIO"
import { usersDB, floorsDB, facilitiesDB } from "../infra/database"

import { Entity } from "../model/entities"
import { Facility } from "../model/facilities"
import { Floor } from "../model/floors"
import { User } from "../model/user"

export function sendUsersData(){
  usersDB.find({}, (err: string, docs: User[])=>{
    checkError(err)
    serverIO.sendData("usersData", docs)
  })
}

export function sendFacilitiesData(){
  facilitiesDB.find({}, (err: string, docs: Facility[])=>{
    checkError(err)
    serverIO.sendData("facilitiesData", docs)
  })
}

export function sendFloorsData(){
  floorsDB.find({}, (err: string, docs: Floor[])=>{
    checkError(err)
    serverIO.sendData("floorsData", docs)
  })
}

export function sendEntitiesData(entities: Entity[]){
  serverIO.sendData("entitiesData", entities)
}