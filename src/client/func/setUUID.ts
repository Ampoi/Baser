export const setUUID =  ()=>{
  let uuid = localStorage.getItem("uuid")
  if(!uuid){
    const newUUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (a) => {
      let r = (new Date().getTime() + Math.random() * 16) % 16 | 0, v = a == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    localStorage.setItem("uuid", newUUID)
    console.log("createNewUUID! id=>" + localStorage.getItem("uuid"));
    uuid = newUUID
  }
  return uuid
}