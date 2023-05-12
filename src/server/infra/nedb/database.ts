import Database from "nedb"

import { checkError } from "../../func/checkError"

type chunkDatabaseType = "users" | "facilities" | "floors" | "entities"

export function createDatabase(name: string, type: chunkDatabaseType): Database{
  const path = (type == "users") ? "users" : `chunks/${name}/${type}`
  const newDB = new Database({ filename: `./database/${path}.db` })
  newDB.loadDatabase((error) => {
    checkError(error)
    console.log(`📁Loaded ${name} ${type}Database compeleted`);
  })

  return newDB
}