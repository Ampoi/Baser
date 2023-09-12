import { generateUID } from "../../utils/generateUID";

export function getUID() {
    let uuid = localStorage.getItem("uuid")
    if (uuid == null) {
        const newUUID = generateUID()
        localStorage.setItem("uuid", newUUID)
        console.log("🎉created new UID: " + localStorage.getItem("uuid"));
        uuid = newUUID
    }
    return uuid
}