export default (facilitiesData, images, tileSize, setUserCenterX, setUserCenterY, items)=>{
  facilitiesData.forEach(facilityData => {
    noTint()
    image(
      images[facilityData.id],
      facilityData.tileX*tileSize+setUserCenterX, facilityData.tileY *tileSize+setUserCenterY,
      tileSize, tileSize
    )
    const alpha = 255 - Math.round((facilityData.hp)/(items[facilityData.id].hp)*255)
    tint(255, alpha)
    image(
      images.crack,
      facilityData.tileX*tileSize+setUserCenterX, facilityData.tileY *tileSize+setUserCenterY,
      tileSize, tileSize
    )
  })
}