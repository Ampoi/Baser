import p5 from "p5"
import { tileSize } from "../model/tile"
import { Images } from "../main"
import { drawChunk } from "./chunk"

export const drawMap = (p: p5, map: number[][], images: Images) => {
  drawChunk((drawX, drawY, x, y,)=>{
    if(map[y] != undefined && map[y][x] != undefined){
      const height = map[y][x]
      
      let tileColor: p5.Image
      if(height < 51){
        tileColor = images.mars_1
      }else if (height < 102){
        tileColor = images.mars_2
      }else if (height < 153){
        tileColor = images.mars_3
      }else if (height < 204){
        tileColor = images.mars_4
      }else{
        tileColor = images.mars_5
      }
      p.image(
        tileColor,
        drawX, drawY,
        tileSize, tileSize
      )
    }else{
      p.fill(0)
      p.rect(drawX, drawY, tileSize, tileSize)
    }
  })
}