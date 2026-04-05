import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InventoryItem } from '../shared/models/model';
import { InventoryItemEditTrigger } from '../shared/inventory-item-edit-trigger';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { first, Observable } from 'rxjs';
import { InventoryService } from '../shared/services/inventory-service/inventory-service';
import { CdkDropList, CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { ShoppingService } from '../shared/services/shopping-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-shopping-view',
  imports: [
    AsyncPipe,
    CdkDropList,
    CdkDrag,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule
],
  templateUrl: './shopping-view.html',
  styleUrl: './shopping-view.scss',
})
export class ShoppingView {
  inventoryService = inject(InventoryService);
  shoppingService = inject(ShoppingService);
  private inventoryItemEditTrigger = inject(InventoryItemEditTrigger);

  displayedColumns: string[] = ['dragger', 'name', 'quantityToBuy', 'checked'];

  drop(event: CdkDragDrop<string>) {
    this.shoppingService.moveItemInList(event.item.data.id, event.currentIndex);
  }

  getShoppingBasket(): Observable<InventoryItem[]> {
    return this.shoppingService.shoppingListData$;
  }

  onItemChecked(item: InventoryItem) {
    item.checked = !item.checked;
    this.inventoryService.editItem(item);
  }

  onQuantityToBuyChanged(newValue: string, item: InventoryItem) {
    item.quantityToBuy = Number(newValue);
    this.inventoryService.editItem(item);
  }

  addNewItem() {
    this.inventoryItemEditTrigger.openInventoryItemEdit();
  }

  updateInventory() {
    this.inventoryService
      .getInventoryWithFilter(
        (item) => item.quantity < item.minQuantity && !!item.checked && !!item.quantityToBuy,
      )
      .pipe(first())
      .subscribe((boughtItems: InventoryItem[]) => {
        boughtItems.forEach((item) => {
          item.checked = false;
          item.quantity = Number(item.quantity) + item.quantityToBuy!;
          item.quantityToBuy = 0;
        });
        this.inventoryService.updateItems(boughtItems);
      });
  }
}
