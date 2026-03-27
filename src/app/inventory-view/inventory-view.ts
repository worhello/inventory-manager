import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InventoryService } from '../inventory-service';
import { InventoryItem } from '../shared/models/model';
import { InventoryItemEdit } from '../shared/inventory-item-edit/inventory-item-edit';

@Component({
  selector: 'app-inventory-view',
  imports: [],
  templateUrl: './inventory-view.html',
  styleUrl: './inventory-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryView {

  dialog = inject(MatDialog);

  constructor(public inventoryService: InventoryService, private cdRef: ChangeDetectorRef) {
    //
  }

  editItem(item: InventoryItem) {
    this.openInventoryItemEdit(item, (updatedItem) => {
      this.inventoryService.editItem(updatedItem);
      this.cdRef.markForCheck();
    });
  }

  deleteItem(item: InventoryItem) {
    this.inventoryService.deleteItem(item.id);
      this.cdRef.markForCheck();
  }

  addNewItem() {
    this.openInventoryItemEdit(null, (newItem) => {
      this.inventoryService.createItem(newItem);
      this.cdRef.markForCheck();
    });
  }

  private openInventoryItemEdit(itemToEdit: InventoryItem | null, itemCreatedFunc: (item: InventoryItem) => void) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (itemToEdit) {
      dialogConfig.data = itemToEdit;
    }

    let dialogRef = this.dialog.open(InventoryItemEdit, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        itemCreatedFunc(result);
      }
    });
  }
}
