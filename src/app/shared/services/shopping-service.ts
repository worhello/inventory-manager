import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { InventoryItem } from '../models/model';
import { InventoryService } from './inventory-service/inventory-service';

export interface ShoppingListData {
  items: InventoryItem[],
  sortOrder: string[] // sort by itemId
}

@Injectable({
  providedIn: 'root',
})
export class ShoppingService {

  private inventoryService = inject(InventoryService);

  private shoppingListOrder: string[] = [];
  private shoppingListOrderSource = new BehaviorSubject<string[]>([]);
  private shoppingListOrder$: Observable<string[]> = this.shoppingListOrderSource.asObservable();
  private shoppingBasketItems$: Observable<InventoryItem[]>;

  shoppingListData$: Observable<InventoryItem[]>;

  constructor() {
    this.shoppingBasketItems$ = this.inventoryService.getInventoryWithFilter((item) => item.quantity < item.minQuantity);

    const shoppingListOrderFromStorage = localStorage.getItem('shoppingListOrder');
    if (shoppingListOrderFromStorage) {
      this.shoppingListOrder = this.updateShoppingList([], JSON.parse(shoppingListOrderFromStorage));
    }

    this.shoppingBasketItems$.subscribe((items: InventoryItem[]) => {
      const newList = this.updateShoppingList(this.shoppingListOrder, items.map(item => item.id));
      this.updateList(newList);
    });

    this.shoppingListData$ = combineLatest([this.shoppingBasketItems$, this.shoppingListOrder$])
      .pipe(
         map(([items, sortOrder]) => (items.sort((a: InventoryItem, b: InventoryItem) => sortOrder.indexOf(a.id) - sortOrder.indexOf(b.id)))),
      );
  }

  private updateShoppingList(originalList: string[], shoppingListOrderFromStorage: string[]): string[] {
    const result: string[] = [...originalList];
    for (const item of shoppingListOrderFromStorage) {
      if (item && result.indexOf(item) === -1) {
        result.push(item);
      }
    }
    return result;
  }

  notify() {
    this.shoppingListOrderSource.next(this.shoppingListOrder);
  }

  updateList(newList: string[]) {
    this.shoppingListOrder = newList;
    this.notify();
    localStorage.setItem('shoppingListOrder', JSON.stringify(this.shoppingListOrder));
  }

  public moveItemInList(itemId: string, newIndex: number) {
    const oldIndex = this.shoppingListOrder.indexOf(itemId);
    if (oldIndex === -1) {
      console.log("missing shopping list item - " + itemId);
      return;
    }

    const result = [...this.shoppingListOrder]; // copy array to avoid mutation
    const [element] = result.splice(oldIndex, 1); // remove element at "from"
    result.splice(newIndex, 0, element);      // insert element at "to"

    this.updateList(result);
  }

  public exportShoppingList() {
    return this.shoppingListOrder;
  }
}
