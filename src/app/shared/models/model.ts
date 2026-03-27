
export type InventoryQuantityKey = {
    id: string,
    quantity: number
}

export type InventoryItem = InventoryQuantityKey & {
    name: string,
    minQuantity: number,
    category: string,
    expiry?: Date,
}