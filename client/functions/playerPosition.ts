class PlayerPosition {
    x: number = 0
    y: number = 0

    set(x: number, y: number){
        this.x = x
        this.y = y
    }

    get(){
        return [this.x, this.y]
    }
}

export const playerPosition = new PlayerPosition()