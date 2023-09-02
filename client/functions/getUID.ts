import { generateUID } from "../../functions/generateUID";

export function getUID() {
    let uuid = localStorage.getItem("uuid")
    if (uuid == null) {
        const newUUID = generateUID()
        localStorage.setItem("uuid", newUUID)
        console.log("🎉created new UID: " + localStorage.getItem("uuid"));
        console.log(
            "\u001b[31m"+   "w"+
            "\u001b[32m"+   "e"+
            "\u001b[33m"+   "l"+
            "\u001b[34m"+   "c"+
            "\u001b[35m"+   "o"+
            "\u001b[36m"+   "m"+
            "\u001b[37m"+   "e"+
                            "!!!"
        )
        uuid = newUUID
    }
    return uuid
}