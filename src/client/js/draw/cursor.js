export default (setUserCenterX, setUserCenterY, tileSize, cursorTile)=>{
  const cursorTileX = Math.floor((mouseX-setUserCenterX)/tileSize)
  const cursorTileY = Math.floor((mouseY-setUserCenterY)/tileSize)
  noStroke()
  noTint()
  fill(255, 255, 255, 100)
  rect(cursorTile.X*tileSize+setUserCenterX, cursorTile.Y*tileSize+setUserCenterY, tileSize, tileSize)
  return {X:cursorTileX, Y:cursorTileY}
}