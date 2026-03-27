import { Injectable } from '@angular/core';
import { InventoryItem, InventoryQuantityKey } from './shared/models/model';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {

  inventory: Map<string, InventoryItem> = new Map();
  categories: string[] = [];

  constructor() {
    this.readLocalStorage();
  }
  
  private syncLocalStorage() {
    localStorage.setItem('inventory', JSON.stringify(Array.from(this.inventory)));
    localStorage.setItem('categories', JSON.stringify(Array.from(this.categories)));
    
    this.readLocalStorage();
  }

  private readLocalStorage() {
    let inventoryFromStorage = localStorage.getItem('inventory');
    if (inventoryFromStorage) {
      this.inventory = new Map(JSON.parse(inventoryFromStorage));
    }

    let categoriesFromStorage = localStorage.getItem('categories');
    if (categoriesFromStorage) {
      this.categories = new Array(JSON.parse(categoriesFromStorage));
    }
  }
  
  public getAllInventory(): Iterable<InventoryItem> {
    return this.inventory.values();
  }

  public searchByName(term: string): InventoryItem | undefined {
    return [...this.getAllInventory()].find(item => item.name === term);
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

  private _createOrUpdateItem(item: InventoryItem) {
    this.inventory.set(item.id, item);
  }

  public deleteItem(itemId: string) {
    this._deleteItem(itemId);
    this.syncLocalStorage();
  }
  
  public deleteItems(itemIds: string[]) {
    itemIds.forEach(itemId => this._deleteItem(itemId));
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
    let item = this.inventory.get(id);
    if (!item) {
      return;
    }

    item.quantity = Math.max(item.quantity - quantityToRemove, 0);
  }


}
