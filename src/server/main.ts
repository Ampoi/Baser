import { checkError } from "./func/checkError"
import { createDatabase } from "./infra/nedb/database"
import { serverIO } from "./infra/socketIO"

import { user, uuid } from "./model/user"

const PORT  = 3000
const chunkSize = 64

let activeChunks: {
  [key: `${number}|${number}`]: {
    entities: Nedb<any>;
    floors: Nedb<any>;
    facilities: Nedb<any>;
  }
} = {}

serverIO.createServer(PORT)

function createChunk(x: number, y: number){
  const entities = createDatabase(`${x}:${y}`, "entities")
  const floors = createDatabase(`${x}:${y}`, "floors")
  const facilities = createDatabase(`${x}:${y}`, "facilities")
  return {entities, floors, facilities}
}

const usersDatabase = createDatabase("users", "users")

serverIO.onConnect((socket)=>{
  console.log('🌐 a user connected!');
  socket.on("userLogined", (uuid: uuid) => {
    usersDatabase.findOne({"uuid":  uuid}, (err, doc: user) =>{
      checkError(err)
      let newUser: user;
      if(doc){
        newUser = doc
      }else{
        const createdUser = user.createNewUser(uuid)
        usersDatabase.insert(createdUser)
        newUser = createdUser
      }

      const chunkX = Math.round(newUser.position.x / chunkSize)
      const chunkY = Math.round(newUser.position.y / chunkSize)
      if(!activeChunks[`${chunkX}|${chunkY}`]){ activeChunks[`${chunkX}|${chunkY}`] = createChunk(0, 0) }
    })
  })
})