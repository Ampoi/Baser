import { checkError } from "./checkError"
import { serverIO } from "../infra/serverIO"
import { usersDB, floorsDB, facilitiesDB } from "../infra/database"

export function sendUsersData(){
  usersDB.find({}, (err, docs)=>{
    checkError(err)
    serverIO.sendData("usersData", docs)
  })
}

export function sendFacilitiesData(){
  facilitiesDB.find({}, (err, docs)=>{
    checkError(err)
    serverIO.sendData("facilitiesData", docs)
  })
}

export function sendFloorsData(){
  floorsDB.find({}, (err, docs)=>{
    checkError(err)
    serverIO.sendData("floorsData", docs)
  })
}

export function sendEntitiesData(entities){
  serverIO.sendData("entitiesData", entities)
}