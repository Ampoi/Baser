export default (facilitiesData, images, tileSize, setUserCenterX, setUserCenterY)=>{
  facilitiesData.forEach(facilityData => {
    switch (facilityData.id) {
      case "iron_floor":
        stroke(0)
        strokeWeight(0.5)
        image(
          images.iron_floor,
          facilityData.tileX*tileSize+setUserCenterX, facilityData.tileY *tileSize+setUserCenterY,
          tileSize, tileSize
        )            
        break;
      default:
        fill("#FF01FF")
        rect(
          facilityData.tileX*tileSize+setUserCenterX, facilityData.tileY*tileSize+setUserCenterX,
          tileSize, tileSize
        )
        break;
    }
  })
}