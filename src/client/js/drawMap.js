export default (tileSize, playerData, images)=>{
  background(0);
  const windowHeightTileAmount = Math.ceil(windowHeight/tileSize)
  const windowWidthTileAmount = Math.ceil(windowWidth/tileSize)
  const windowStartCornerTileX = Math.floor((playerData.x-windowWidth/2)/tileSize)
  const windowStartCornerTileY = Math.floor((playerData.y-windowHeight/2)/tileSize)
  const wSCDifferenceX = windowStartCornerTileX*tileSize-(playerData.x-windowWidth/2)
  const wSCDifferenceY = windowStartCornerTileY*tileSize-(playerData.y-windowHeight/2)
  for (let iy = 0; iy < windowHeightTileAmount+1; iy++) {
    for (let ix = 0; ix < windowWidthTileAmount+1; ix++) {
      let tileHeight = Math.floor(noise((ix+windowStartCornerTileX)*0.05)*80 - 20)*3 + Math.floor(noise((iy+windowStartCornerTileY)*0.05)*80 - 20)*3 + (sin((ix+windowStartCornerTileX)*0.02)+sin((iy+windowStartCornerTileY)*0.02))*20
      let tileColor
      //タイルの高さから色変換
      if(tileHeight < 51){
        tileColor = images.mars_1
      }else if (tileHeight < 102){
        tileColor = images.mars_2
      }else if (tileHeight < 153){
        tileColor = images.mars_3
      }else if (tileHeight < 204){
        tileColor = images.mars_4
      }else{
        tileColor = images.mars_5
      }
      image(
        tileColor,
        ix*tileSize+wSCDifferenceX, iy*tileSize+wSCDifferenceY,
        tileSize, tileSize
      )
    }
  }
}