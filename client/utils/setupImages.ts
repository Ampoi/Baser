import p5 from "p5"
import { Images } from "../model/Images"

const imageNames = ["astronaut", "iron_floor", "mars_3","conveyor","mars_1","mars_4","iron","mars_2","mars_5"]


//クラスにしてimportとかでできないかやってみたい
export function setUpImages(p: p5){
    let newImages : Partial<Images> = {}
    imageNames.forEach((name) => {
        newImages[name] = p.loadImage(`images/${name}.png`)
    })
    return newImages
}