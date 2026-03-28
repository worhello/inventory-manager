import { Injectable } from '@angular/core';
import { InventoryItem, InventoryQuantityKey } from './shared/models/model';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  inventory: Map<string, InventoryItem> = new Map<string, InventoryItem>();
  categories: string[] = [];

  constructor() {
    this.readAndValidateLocalStorage();
  }

  private readAndValidateLocalStorage() {
    this.readLocalStorage();

    if (!this.validateAllValues(this.getAllInventory())) {
      this.syncLocalStorage();
    }

  }

  private validateAllValues(items: Iterable<InventoryItem>): boolean {
    let allValuesValid = true;

    for (let item of items) {
      let quantityToBuy = this.getQuantityToBuy(item);
      if (quantityToBuy > 0 && quantityToBuy !== item.quantityToBuy) {
        item.quantityToBuy = quantityToBuy;
        allValuesValid = false;
      }
    }

    return allValuesValid;
  }

  private getQuantityToBuy(item: InventoryItem) {
    if (item.quantity >= item.minQuantity) {
      return 0;
    }

    const deficit = item.minQuantity - item.quantity;
    if (item.quantityToBuy && item.quantityToBuy >= deficit) {
      return item.quantityToBuy;
    }

    return deficit;
  }

  private readLocalStorage() {
    const inventoryFromStorage = localStorage.getItem('inventory');
    if (inventoryFromStorage) {
      this.inventory = new Map(JSON.parse(inventoryFromStorage));
    }

    const categoriesFromStorage = localStorage.getItem('categories');
    if (categoriesFromStorage) {
      this.categories = new Array(JSON.parse(categoriesFromStorage));
    }
  }

  private syncLocalStorage() {
    localStorage.setItem('inventory', JSON.stringify(Array.from(this.inventory)));
    localStorage.setItem('categories', JSON.stringify(Array.from(this.categories)));

    this.readLocalStorage();
  }

  public getAllInventory(): Iterable<InventoryItem> {
    return this.inventory.values();
  }

  public searchByName(term: string): InventoryItem | undefined {
    return [...this.getAllInventory()].find((item) => item.name === term);
  }

  public createItem(item: InventoryItem) {
    item.id = uuid();
    this._createOrUpdateItem(item);
    this.syncLocalStorage();
  }

  public editItem(updatedItem: InventoryItem) {
    this._createOrUpdateItem(updatedItem);
    this.syncLocalStorage();
  }
  
  public updateItems(updatedItems: InventoryItem[]) {
    updatedItems.forEach(this._createOrUpdateItem);
    this.syncLocalStorage();
  }

  private _createOrUpdateItem(item: InventoryItem) {
    this.updateQuantityToBuy(item.id);

    this.inventory.set(item.id, item);
  }

  public deleteItem(itemId: string) {
    this._deleteItem(itemId);
    this.syncLocalStorage();
  }

  public deleteItems(itemIds: string[]) {
    itemIds.forEach((itemId) => this._deleteItem(itemId));
    this.syncLocalStorage();
  }

  private _deleteItem(itemId: string) {
    this.inventory.delete(itemId);
  }

  public removeItems(itemsToRemove: InventoryQuantityKey[]) {
    itemsToRemove.forEach((item) => this._removeItem(item.id, item.quantity));
    this.syncLocalStorage();
  }

  public removeItem(itemToRemove: InventoryQuantityKey) {
    this._removeItem(itemToRemove.id, itemToRemove.quantity);
    this.syncLocalStorage();
  }

  private _removeItem(id: string, quantityToRemove: number) {
    const item = this.inventory.get(id);
    if (!item) {
      return;
    }

    item.quantity = Math.max(item.quantity - quantityToRemove, 0);
    this.updateQuantityToBuy(id);
  }

  private updateQuantityToBuy(id: string) {
    const item = this.inventory.get(id);
    if (!item) {
      return;
    }

    item.quantityToBuy = this.getQuantityToBuy(item);
  }
}
