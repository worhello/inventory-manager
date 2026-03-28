import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { InventoryService } from '../inventory-service';
import { InventoryItem } from '../shared/models/model';
import { InventoryItemEditTrigger } from '../shared/inventory-item-edit-trigger';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-inventory-view',
  imports: [MatButtonModule, MatCardModule, MatExpansionModule],
  templateUrl: './inventory-view.html',
  styleUrl: './inventory-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryView {
  inventoryService = inject(InventoryService);
  private cdRef = inject(ChangeDetectorRef);

  dialog = inject(MatDialog);
  inventoryItemEditTrigger = inject(InventoryItemEditTrigger);

  editItem(item: InventoryItem) {
    this.openInventoryItemEdit(item);
  }

  deleteItem(item: InventoryItem) {
    this.inventoryService.deleteItem(item.id);
    this.cdRef.markForCheck();
  }

  addNewItem() {
    this.openInventoryItemEdit();
  }

  private openInventoryItemEdit(item?: InventoryItem) {
    this.inventoryItemEditTrigger.openInventoryItemEdit(item, () => {
      this.cdRef.markForCheck();
    });
  }

  getAmountNeeded(item: InventoryItem) {
    return Math.max(item.minQuantity - item.quantity, 0);
  }
}
