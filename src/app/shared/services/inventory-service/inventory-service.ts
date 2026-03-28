import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { InventoryItem, InventoryQuantityKey } from '../../models/model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  
  inventory: Map<string, InventoryItem> = new Map<string, InventoryItem>();
  private inventorySource = new BehaviorSubject<InventoryItem[]>([]);
  inventory$: Observable<InventoryItem[]> = this.inventorySource.asObservable();
  
  categories: string[] = [];
  private categoriesSource = new BehaviorSubject<string[]>([]);
  categories$: Observable<string[]> = this.categoriesSource.asObservable();

  constructor() {
    this.readAndValidateLocalStorage();
  }

  private readAndValidateLocalStorage() {
    this.readLocalStorage();

    if (!this.validateAllValues(this.inventory)) {
      this.syncLocalStorage();
    } else {
      this.updateObservers();
    }
  }

  private validateAllValues(itemsMap: Map<string, InventoryItem>): boolean {
    let allValuesValid = true;

    // const checkInvalidKey = (key: any) => {
    //   if (itemsMap.get(key)) {
    //     itemsMap.delete(key);
    //     console.log(`Removing invalid key entries from the original map - ${key}`);
    //     allValuesValid = false;
    //   }
    // }
    // [null, undefined, "", '', 0].forEach(checkInvalidKey);

    const items = itemsMap.values();

    const categoriesSet = new Set<string>();
    for (const item of items) {
      const quantityToBuy = this.getQuantityToBuy(item);
      if (quantityToBuy > 0 && quantityToBuy !== item.quantityToBuy) {
        console.log(`allValuesInvalid - quantityToBuy incorrect: ${item.quantityToBuy} instead of ${quantityToBuy}`);
        item.quantityToBuy = quantityToBuy;
        allValuesValid = false;
      }

      if (item.expiry && typeof item.expiry === 'string') {
        // it gets stored as a string, we need to parse it back to an object
        item.expiry = new Date(item.expiry);
      }
      
      categoriesSet.add(item.category);
      if (this.categories.indexOf(item.category) < 0) {
        console.log(`allValuesInvalid - missing category in cache: ${item.category}`);
        this.categories.push(item.category);
        allValuesValid = false;
      }
    }

    if (categoriesSet.size !== this.categories.length) {
      console.log(`allValuesInvalid - too many categories in cache: ${categoriesSet.size} vs ${this.categories.length}`);
      this.categories = Array.from(categoriesSet);
      allValuesValid = false;
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
      this.categories = JSON.parse(categoriesFromStorage);
    }
  }

  private syncLocalStorage() {
    localStorage.setItem('inventory', JSON.stringify(Array.from(this.inventory)));
    localStorage.setItem('categories', JSON.stringify(Array.from(this.categories)));

    this.updateObservers();
  }

  public getInventoryWithFilter(filterFunc: (item: InventoryItem) => boolean): Observable<InventoryItem[]> {
    return this.inventory$
      .pipe(
        map((items: InventoryItem[]) => items.filter(filterFunc))
      );
  }

  public searchByName(term: string): Observable<InventoryItem | undefined> {
    return this.inventory$
      .pipe(
        map((items: InventoryItem[]) => items.find(item => item.name === term))
      );
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
    updatedItems.forEach((item: InventoryItem) => this._createOrUpdateItem(item));
    this.syncLocalStorage();
  }

  private _createOrUpdateItem(item: InventoryItem) {
    this.updateQuantityToBuy(item);

    if (this.categories.indexOf(item.category) < 0) {
      this.categories.push(item.category);
    }

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

    // TODO - recalculate categories to remove them dynamically instead of just on load
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
    this.updateQuantityToBuy(item);
  }

  private updateQuantityToBuy(item: InventoryItem) {
    item.quantityToBuy = this.getQuantityToBuy(item);
  }

  private updateObservers() {
    this.inventorySource.next([...this.inventory.values()]);
    this.categoriesSource.next(this.categories);
  }

  public resetInventory() {
    localStorage.setItem('inventory', "");
    localStorage.setItem('categories', "");

    this.inventory = new Map();
    this.categories.length = 0;
  }

  public exportInventory(): string {
    return JSON.stringify({
      inventory: structuredClone([...this.inventory.values()]),
      categories: structuredClone(this.categories)
    });
  }
}
