import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { InventoryItem } from '../shared/models/model';
import { InventoryItemEditTrigger } from '../shared/inventory-item-edit-trigger';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { InventoryService } from '../shared/services/inventory-service/inventory-service';

@Component({
  selector: 'app-inventory-view',
  imports: [AsyncPipe, MatButtonModule, MatCardModule, MatExpansionModule],
  templateUrl: './inventory-view.html',
  styleUrl: './inventory-view.scss',
})
export class InventoryView {
  inventoryService = inject(InventoryService);
  dialog = inject(MatDialog);
  inventoryItemEditTrigger = inject(InventoryItemEditTrigger);

  inventory$: Observable<InventoryItem[]>;
  categories$: Observable<string[]>;

  constructor() {
    this.inventory$ = this.inventoryService.inventory$;
    this.categories$ = this.inventoryService.categories$;
  }

  editItem(item: InventoryItem) {
    this.openInventoryItemEdit(item);
  }

  deleteItem(item: InventoryItem) {
    this.inventoryService.deleteItem(item.id);
  }

  addNewItem() {
    this.openInventoryItemEdit();
  }

  private openInventoryItemEdit(item?: InventoryItem) {
    this.inventoryItemEditTrigger.openInventoryItemEdit(item);
  }

  getAmountNeeded(item: InventoryItem) {
    return Math.max(item.minQuantity - item.quantity, 0);
  }
}
