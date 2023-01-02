export default (dock, playerData, images)=>{
  const dockTileSize = 45
  const dockMargin = 8
  const dockWidth = dock.length * dockTileSize + (dock.length+1)*dockMargin

  noStroke()
  noTint()
  fill(40)
  rect(
    (windowWidth-dockWidth)/2 - dockMargin,
    windowHeight-10-dockTileSize - dockMargin*2,
    dockWidth,
    dockTileSize + dockMargin*2,
    dockTileSize/4
  )
  
  //Dock内のボタンの描画
  let counter = 0
  dock.forEach(button => {
    const dockButtonX = (windowWidth-dockWidth)/2+counter*(dockTileSize+dockMargin)
    const dockButtonY = windowHeight-10-dockTileSize - dockMargin
    //ボタンの描画
    noStroke()
    fill(100)
    rect(
      dockButtonX,
      dockButtonY,
      dockTileSize, dockTileSize,
      dockTileSize/8
    )
    //ボタン内の画像の描画
    if(button.image == "item"){
      if(playerData.inventory[counter] != "space"){
        const item = playerData.inventory[counter].id
        noTint()
        image(
          images[item],
          dockButtonX+dockMargin, dockButtonY+dockMargin,
          dockTileSize-dockMargin*2, dockTileSize-dockMargin*2
        )
      }
    }

    //キーの描画
    textSize(dockTileSize/4)
    textAlign(CENTER)
    fill(255)
    text(
      button.key,
      dockButtonX+dockTileSize/2,
      dockButtonY+dockTileSize-dockTileSize/10
    )
    counter += 1
  })

  //Dockのオーバーレイの描画
  const DockCursorX = (windowWidth-dockWidth)/2+playerData.handedItem*(dockTileSize+dockMargin)
  noFill()
  stroke("#009ADF")
  strokeWeight(2)
  rect(
    DockCursorX,
    windowHeight-10-dockTileSize - dockMargin,
    dockTileSize, dockTileSize,
    dockTileSize/8
  )
}