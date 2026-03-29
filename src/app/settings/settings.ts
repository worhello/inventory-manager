import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../shared/services/inventory-service/inventory-service';
import { ShoppingService } from '../shared/services/shopping-service';
import { InventoryExportData, InventoryItem } from '../shared/models/model';

interface ExportData extends InventoryExportData {
  shoppingListData: string[];
};

@Component({
  selector: 'app-settings',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  inventoryService = inject(InventoryService);
  shoppingService = inject(ShoppingService);

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

  exportInventoryToCsv() {
    const exportedInventoryData = this.inventoryService.exportInventory();
    if (exportedInventoryData.inventory.length === 0) {
      alert('No data to export');
      return;
    }
    
    const headerRow = ['id', 'name', 'category', 'quantity', 'minQuantity', 'expiry', 'checked', 'quantityToBuy'];
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headerRow.join(',') + '\n';

    exportedInventoryData.inventory.forEach((item) => {
      csvContent += this.inventoryItemToString(item) + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inventory_manager_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link); // Required for FF

    link.click();
  }

  inventoryItemToString(item: InventoryItem) {
    const fieldsArray: (string | number | boolean | Date | undefined)[] = [
      item.id,
      item.name,
      item.category,
      item.quantity,
      item.minQuantity,
      item.expiry,
      item.checked,
      item.minQuantity
    ];
    return fieldsArray.join(',');
  }

  importInventoryFromCsv() {
    window.alert('Not implemented yet...');
  }

  exportInventoryMetadata() {
    const exportData: ExportData = {
      shoppingListData: this.shoppingService.exportShoppingList(),
      ...this.inventoryService.exportInventory(),
    }

    navigator.clipboard.writeText(JSON.stringify(exportData));
    alert('Copied the inventory state to the clipboard...');
  }
}
