export class Vector{
    public x: number
    public y: number

    constructor(x:number, y:number){
        this.x = x
        this.y = y
    }

    add(vector: Vector){
        this.x += vector.x
        this.y += vector.y
    }

    mult(size: number){
        this.x *= size
        this.y *= size
    }
}