import { Entity } from "../../model/Entity"

class PlayerPosition {
    x: number = 0
    y: number = 0

    set(enitities: Entity[], uid: string){
        const player = enitities.find((entity) => entity.id == uid)
        if( !player ){ throw new Error("プレイヤーのデータが見つかりませんでした！") }
        this.x = player.x
        this.y = player.y
    }

    get(){
        return [this.x, this.y]
    }
}

export const playerPosition = new PlayerPosition()