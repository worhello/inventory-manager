import { inject, Injectable } from '@angular/core';
import { InventoryItem } from './models/model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InventoryItemEdit } from './inventory-item-edit/inventory-item-edit';
import { InventoryService } from '../inventory-service';

@Injectable({
  providedIn: 'root',
})
export class InventoryItemEditTrigger {
  dialog = inject(MatDialog);

  constructor(private inventoryService: InventoryService) {}

   public openInventoryItemEdit(itemToEdit: InventoryItem | undefined, itemCreatedFunc: (item: InventoryItem) => void) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (itemToEdit) {
      dialogConfig.data = itemToEdit;
    }

    let dialogRef = this.dialog.open(InventoryItemEdit, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (itemToEdit) {
          this.inventoryService.editItem(result);
        } else {
          this.inventoryService.createItem(result);
        }

        itemCreatedFunc(result);
      }
    });
  }
}
