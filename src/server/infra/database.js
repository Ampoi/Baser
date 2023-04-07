import Database from "nedb"

import { checkError } from "../function/checkError.js"

//ユーザーデータベースと接続
export const usersDB = new Database({ filename: "./assets/users.db" });
usersDB.loadDatabase((error) => {
  checkError(error)
  console.log("📁Loaded UsersDatabase compeleted");
});

//床データベースと接続
export const floorsDB = new Database({ filename: "./assets/floors.db" });
floorsDB.loadDatabase((error) => {
  checkError(error)
  console.log("📁Loaded FloorsDatabase compeleted");
});

//設備データベースと接続
export const facilitiesDB = new Database({ filename: "./assets/facilities.db" });
facilitiesDB.loadDatabase((error) => {
  checkError(error)
  console.log("📁Loaded FacilitiesDatabase compeleted");
});