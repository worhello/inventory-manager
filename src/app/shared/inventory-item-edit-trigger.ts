import { inject, Injectable } from '@angular/core';
import { InventoryItem } from './models/model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InventoryItemEdit } from './inventory-item-edit/inventory-item-edit';
import { InventoryService } from './services/inventory-service/inventory-service';

@Injectable({
  providedIn: 'root',
})
export class InventoryItemEditTrigger {
  private inventoryService = inject(InventoryService);

  dialog = inject(MatDialog);

  public openInventoryItemEdit(itemToEdit?: InventoryItem) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (itemToEdit) {
      dialogConfig.data = itemToEdit;
    }

    const dialogRef = this.dialog.open(InventoryItemEdit, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (itemToEdit) {
          this.inventoryService.editItem(result);
        } else {
          this.inventoryService.createItem(result);
        }
      }
    });
  }
}
