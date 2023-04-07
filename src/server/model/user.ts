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