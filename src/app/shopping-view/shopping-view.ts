import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { InventoryService } from '../inventory-service';
import { FormsModule } from '@angular/forms';
import { InventoryItem } from '../shared/models/model';
import { InventoryItemEditTrigger } from '../shared/inventory-item-edit-trigger';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-shopping-view',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatCheckboxModule, FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatDialogModule, MatButtonModule, MatTableModule],
  templateUrl: './shopping-view.html',
  styleUrl: './shopping-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingView {
  inventoryService = inject(InventoryService);
  private inventoryItemEditTrigger = inject(InventoryItemEditTrigger);
  private cdRef = inject(ChangeDetectorRef);

  displayedColumns: string[] = ['checked', 'category', 'name', 'quantityToBuy'];

  getShoppingBasket() {
    return [...this.inventoryService.getAllInventory()].filter(item => item.quantity < item.minQuantity);
  }

  onItemChecked(item: InventoryItem) {
    console.log(`quantityToBuy: ${item.quantityToBuy}`)
    item.checked = !item.checked;
    this.inventoryService.editItem(item);
  }

  onQuantityToBuyChanged(newValue: string, item: InventoryItem) {
    item.quantityToBuy = Number(newValue);
    this.inventoryService.editItem(item);
  }

  addNewItem() {
    this.inventoryItemEditTrigger.openInventoryItemEdit(undefined, () => {
      this.cdRef.markForCheck();
    });
  }

  updateInventory() {
    const boughtItems = this.getShoppingBasket().filter(item => item.checked && item.quantityToBuy);
    boughtItems.forEach(item => {
      item.checked = false;
      item.quantity = Number(item.quantity) + item.quantityToBuy!;
      item.quantityToBuy = 0;
    });

    this.inventoryService.updateItems(boughtItems);
  }
}
