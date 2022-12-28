export default (facilitiesData, images, tileSize, setUserCenterX, setUserCenterY)=>{
  facilitiesData.forEach(facilityData => {
    try{
      image(
        images[facilityData.id],
        facilityData.tileX*tileSize+setUserCenterX, facilityData.tileY *tileSize+setUserCenterY,
        tileSize, tileSize
      )
    }catch{
      fill("#FF01FF")
      rect(
        facilityData.tileX*tileSize+setUserCenterX, facilityData.tileY*tileSize+setUserCenterX,
        tileSize, tileSize
      )
    }
  })
}