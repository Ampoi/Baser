import p5 from "p5"
import { Entity } from "../../model/Entity"

export type Images = {
    [key: Entity["name"]]: p5.Image
}