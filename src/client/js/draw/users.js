export default (tileSize, images, usersData, setUserCenterX, setUserCenterY)=>{
  usersData.forEach(userData => {
    let userImage
    switch (userData.direction) {
      case "up":
        userImage = images.user_up
        break;
      case "down":
        userImage = images.user_down
        break;
      case "left":
        userImage = images.user_left
        break;
      case "right":
        userImage = images.user_right
        break;
      default:
        userImage = images.user_down
        break;
    }
    image(
      userImage,
      userData.x - tileSize/2 + setUserCenterX, userData.y - tileSize/2 + setUserCenterY,
      tileSize, tileSize
    )
    fill(255)
    textAlign(CENTER)
    text(userData.name, userData.x + setUserCenterX, userData.y - tileSize*3/5 + setUserCenterY,)
  });
}