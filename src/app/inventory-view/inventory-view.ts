import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InventoryService } from '../inventory-service';
import { InventoryItem } from '../shared/models/model';
import { InventoryItemEdit } from '../shared/inventory-item-edit/inventory-item-edit';
import { InventoryItemEditTrigger } from '../shared/inventory-item-edit-trigger';

@Component({
  selector: 'app-inventory-view',
  imports: [],
  templateUrl: './inventory-view.html',
  styleUrl: './inventory-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryView {

  dialog = inject(MatDialog);
  inventoryItemEditTrigger = inject(InventoryItemEditTrigger);

  constructor(public inventoryService: InventoryService, private cdRef: ChangeDetectorRef) {
  }

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
}
