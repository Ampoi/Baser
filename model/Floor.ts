export const floorNames = ["conveyor"] as const

export type Floor = {
    name: typeof floorNames[number]
    x: number
    y: number
    direction: number
}