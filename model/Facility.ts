export const facilityNames = ["blastFurnace"] as const

export type Facility = {
    name: typeof facilityNames[number]
    x: number
    y: number
    direction: number
}