import { tileSize } from "../model/tile"
import { chunkTileSize } from "../model/chunk"

export const drawChunk = (
  drawFunc: (drawX: number, drawY: number, x: number, y: number, ...args:any) => void,
  ...drawFuncArgs: any
) => {
  for (let y = 0; y < chunkTileSize; y++) {
    for (let x = 0; x < chunkTileSize; x++) {
      const drawX = x*tileSize
      const drawY = y*tileSize

      drawFunc(drawX, drawY, x, y, drawFuncArgs)
    }
  }
}