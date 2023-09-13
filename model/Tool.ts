export const toolNames = ["drill"] as const

export type Tool = {
    name: typeof toolNames[number]
}