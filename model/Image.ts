import p5 from "p5"

export const imageNames = [
    "iron_floor",
    "conveyor",
    "mars_1",
    "mars_2",
    "mars_3",
    "mars_4",
    "mars_5",
] as const

export type Images = { [key in typeof imageNames[number]]: p5.Image }