import { Entity } from "../../model/Entity"
import p5, { Image } from "p5"

const imageNames = ["astronaut", "iron_floor", "mars_3","conveyor","mars_1","mars_4","iron","mars_2","mars_5"]

class Images {
    public images: { [key: Entity["name"]]: p5.Image } = {}

    setUpImages(p: p5){
        imageNames.forEach((name) => {
            this.images[name] = p.loadImage(`images/${name}.png`)
        })
    }
}

export const images = new Images()