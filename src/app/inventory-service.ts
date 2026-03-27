import { Injectable } from '@angular/core';
import { InventoryItem, InventoryQuantityKey } from './shared/models/model';
import { generate } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {

  inventory: Map<string, InventoryItem>;
  categories: string[];

  static generateSampleInventory(): Map<string, InventoryItem> {
    let sampleData = new Map();
    sampleData.set('sample-1', {
      id: "sample-1",
      name: "pizza",
      quantity: 3,
      minQuantity: 1,
      category: 'freezer'
    });
    sampleData.set('sample-2', {
      id: "sample-2",
      name: "milk",
      quantity: 1,
      minQuantity: 1,
      expiry: new Date(),
      category: 'fridge'
    });
    sampleData.set('sample-3', {
      id: "sample-3",
      name: "smoked paprika",
      quantity: 0,
      minQuantity: 1,
      category: 'spices'
    });
    return sampleData;
  }

  static generateSampleCategories(): string[] {
    return [
      'freezer',
      'fridge',
      'spices'
    ]
  }

  constructor() {
    this.inventory = InventoryService.generateSampleInventory();
    this.categories = InventoryService.generateSampleCategories();
    this.readLocalStorage();
  }

  private syncLocalStorage() {
    // load this from localStorage
    // this.inventory = new Map(JSON.parse(localStorage.getItem('inventory')));
    // this.categories = new Array(JSON.parse(localStorage.getItem('categories')));
  }

  private readLocalStorage() {
    // localStorage.setItem('inventory', JSON.stringify(Array.from(this.inventory)));
    // localStorage.setItem('categories', JSON.stringify(Array.from(this.categories)));
  }

  public getAllInventory(): Iterable<InventoryItem> {
    return this.inventory.values();
  }

  public searchByName(term: string): InventoryItem | undefined {
    return [...this.getAllInventory()].find(item => item.name === term);
  }

  public createItem(item: InventoryItem) {
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
