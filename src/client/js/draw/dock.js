export default (dock, dockTileSize, dockMargin, dockWidth)=>{
  fill(40)
  rect(
    (windowWidth-dockWidth)/2 - dockMargin,
    windowHeight-10-dockTileSize - dockMargin*2,
    dockWidth,
    dockTileSize + dockMargin*2
  )
  
  //Dock内のボタンの描画
  let counter = 0
  dock.forEach(button => {
    noStroke()
    fill(100)
    rect(
      (windowWidth-dockWidth)/2+counter*(dockTileSize+dockMargin),
      windowHeight-10-dockTileSize - dockMargin,
      dockTileSize, dockTileSize,
      dockTileSize/8
    )
    textSize(dockTileSize/4)
    textAlign(CENTER)
    fill(255)
    text(
      button.key,
      (windowWidth-dockWidth)/2+counter*(dockTileSize+dockMargin)+dockTileSize/2,
      windowHeight-10-dockMargin-dockTileSize/10
    )
    counter += 1
  })
}