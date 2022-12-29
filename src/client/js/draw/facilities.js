export default (facilitiesData, images, tileSize, setUserCenterX, setUserCenterY, items)=>{
  facilitiesData.forEach(facilityData => {
    try{
      noTint()
      image(
        images[facilityData.id],
        facilityData.tileX*tileSize+setUserCenterX, facilityData.tileY *tileSize+setUserCenterY,
        tileSize, tileSize
      )
      const alpha = 255 - Math.round((facilityData.hp)/(items[facilityData.id].hp)*255)
      text(
        `alpha:${alpha}`,100,200
      )
      tint(255, alpha)
      image(
        images.crack,
        facilityData.tileX*tileSize+setUserCenterX, facilityData.tileY *tileSize+setUserCenterY,
        tileSize, tileSize
      )
    }catch(error){
      console.error(error);
      fill("#FF01FF")
      rect(
        facilityData.tileX*tileSize+setUserCenterX, facilityData.tileY*tileSize+setUserCenterX,
        tileSize, tileSize
      )
    }
  })
}