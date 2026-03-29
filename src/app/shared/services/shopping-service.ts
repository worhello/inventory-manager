import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, first, map, Observable } from 'rxjs';
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
      this.updateList(JSON.parse(shoppingListOrderFromStorage));
    } else {
      this.shoppingBasketItems$.pipe(first()).subscribe((items: InventoryItem[]) => {
        this.updateList(items.map(item => item.id));
      });
    }

    this.shoppingListData$ = combineLatest([this.shoppingBasketItems$, this.shoppingListOrder$])
      .pipe(
         map(([items, sortOrder]) => (items.sort((a: InventoryItem, b: InventoryItem) => sortOrder.indexOf(a.id) - sortOrder.indexOf(b.id)))),
      );
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
    const elem = this.shoppingListOrder[oldIndex];
    this.shoppingListOrder.copyWithin(oldIndex, oldIndex + 1, newIndex + 1)[newIndex]=elem;

    this.updateList(this.shoppingListOrder);
  }

  public exportShoppingList() {
    return this.shoppingListOrder;
  }
}
