
export interface InventoryQuantityKey {
  id: string;
  quantity: number;
}

export interface InventoryItem extends InventoryQuantityKey {
  name: string;
  minQuantity: number;
  category: string;
  expiry?: Date;
  checked?: boolean;
  quantityToBuy?: number;
}

export interface InventoryExportData {
  inventory: InventoryItem[];
  categories: string[];
}
