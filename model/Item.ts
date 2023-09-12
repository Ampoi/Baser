import { Material } from "./Material"
import { Tool } from "./Tool"
import { Floor } from "./Floor"
import { Facility } from "./Facility"

export type Item = {
    name: (Material | Tool | Floor | Facility)["name"]
    amount: number
}