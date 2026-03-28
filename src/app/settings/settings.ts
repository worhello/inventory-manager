import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../shared/services/inventory-service/inventory-service';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  inventoryService = inject(InventoryService);

  @ViewChild('inventoryTextBox') inventoryTextBox: ElementRef = {} as ElementRef;
  showInventoryInput = false;

  resetInventory() {
    if (
      window.confirm(
        'Are you sure you want to reset your inventory? This action cannot be reversed, and you will need to put your entire inventory in again!!!',
      )
    ) {
      this.inventoryService.resetInventory();
    }
  }

  exportInventory() {
    const exportedInventory = this.inventoryService.exportInventory();
    navigator.clipboard.writeText(exportedInventory);
    alert('Copied the inventory state to the clipboard...');
  }

  importInventory() {
    window.alert('Not implemented yet...');
  }
}
