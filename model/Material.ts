export const materialNames = ["iron"] as const

export type Material = {
    name: typeof materialNames[number]
}