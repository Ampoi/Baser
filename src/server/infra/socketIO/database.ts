import Database from "nedb"

import { checkError } from "../../function/checkError"

export function createDatabase(name: string): Database{
  const newDB = new Database({ filename: `./assets/${name}.db` })
  newDB.loadDatabase((error) => {
    checkError(error)
    console.log(`📁Loaded ${name}Database compeleted`);
  })

  return newDB
}