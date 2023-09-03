import p5 from "p5"
import { imageNames, Images } from "../../model/Image"

export function setUpImages(p: p5){
    let newImages : Partial<Images> = {}
    imageNames.forEach((name) => {
        newImages[name] = p.loadImage(`images/${name}.png`)
    })
    return newImages
}