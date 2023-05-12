export type uuid = `${string}-${string}-4${string}-${string}-${string}`

export type user = {
  name: string
  uuid: uuid
  position: {
    x: number
    y: number
  }
}

export const user = {
  createNewUser(uuid: uuid): user {
    return {
      name: "Unknown",
      uuid: uuid,
      position: {
        x: 0, y: 0
      }
    }
  }
}