type ItemsData = {
  [key: string]: {
    name: string,
    type: string,
    hp?: number,
    lifespan?: number,
    speed?: number
  },
}

export const itemsData: ItemsData = {
  "iron_floor":{
    name:"鉄床",
    type:"floor",
    hp:100
  },
  "iron_wall":{
    name:"鉄壁",
    type:"facility",
    hp:500
  },
  "drill":{
    name:"ドリル",
    type:"item"
  },
  "rocket_launcher":{
    name:"ロケットランチャー",
    type:"item"
  },
  "rocket":{
    name:"ロケット",
    type:"entity",
    lifespan:6,
    speed:10/50
  }
}