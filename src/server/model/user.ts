type Item = {
  "id": string,
  "amount": number
}
export type User = {
  "x":50,
  "y":-264,
  "name":"Hello",
  "direction": "up"|"down"|"left"|"right",
  "handedItem":number,
  "inventory":Item[],
  "uuid":string
  "_id"?:string
}

export const User = {
  createUser(uuid: string){
    return {
      x:0,
      y:0,
      name:"Hello",
      direction:"down",
      handedItem:0,
      inventory: [
        {
          id:"iron_floor",
          amount:64
        },
        {
          id:"rocket_launcher",
          amount:1
        },
        {
          id:"drill",
          amount:1
        }
      ],
      uuid: uuid
    }
  }
}