import { checkError } from "./checkError.js"
import { serverIO } from "../infra/serverIO.js"
import { usersDB, floorsDB, facilitiesDB } from "../infra/database.js"

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