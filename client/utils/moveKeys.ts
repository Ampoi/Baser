import { Socket } from "socket.io-client"

const checkKeys = {
    w: false,
    a: false,
    s: false,
    d: false
}

document.addEventListener("keydown", (event) => {
    checkKeys[event.key as keyof typeof checkKeys] = true
})
document.addEventListener("keyup", (event) => {
    checkKeys[event.key as keyof typeof checkKeys] = false
})

export function sendMove(socket: Socket, uid: string){
    const pressedKeys = Object.entries(checkKeys).map((data) => {
        const [key, isPressed] = data
        if( isPressed ){
            return key
        }
    }).filter((key) => !!key)
    if( pressedKeys.length > 0 ) socket.emit("move", uid, pressedKeys)
}