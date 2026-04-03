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

  readonly fileHeaderRow = ['id', 'name', 'category', 'quantity', 'minQuantity', 'expiry', 'checked', 'quantityToBuy'];

  inventoryService = inject(InventoryService);
  shoppingService = inject(ShoppingService);

  @ViewChild('inventoryTextBox') inventoryTextBox: ElementRef = {} as ElementRef;
  showInventoryInput = false;

  @ViewChild('inventoryImportInput') inventoryImportInput: ElementRef = {} as ElementRef;

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
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += this.fileHeaderRow.join(',') + '\n';

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

  confirmInventoryImport() {
    if (window.confirm("Importing a new Inventory will clear any Inventory currently stored in the browser. Are you sure you want to continue?")) {
      this.inventoryImportInput.nativeElement.click();
    }
  }

  onFilesAdded(event: Event) {
    const eventTarget = (event.target as HTMLInputElement);
    if (!eventTarget || !eventTarget.files || eventTarget.files.length === 0) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent: ProgressEvent<FileReader>) => this.handleFileRead(readerEvent);
    reader.readAsDataURL(eventTarget.files[0]);
  }

  private handleFileRead(readerEvent: ProgressEvent<FileReader>) {
      const content = (readerEvent.target?.result as string);
      if (!content) {
        return;
      }

      const dataB64 = content.replace("data:text/csv;base64,", "");
      const decoded = atob(dataB64);

      const lines = decoded.split('\n');
      if (lines[0] != this.fileHeaderRow.join(',')) {
        return;
      }

      const items: InventoryItem[] = [];

      for (let i = 1; i < lines.length; i++) {
        let line = lines[i];
        if (line === "") { // last line will often be empty
          break;
        }

        // The order here is based on this.fileHeaderRow
        const [id, name, category, quantity, minQuantity, expiry, checked, quantityToBuy] = line.split(',');

        const item: InventoryItem = {
          id,
          name,
          category,
          quantity: parseInt(quantity),
          minQuantity: parseInt(minQuantity),
          ...(expiry ? { expiry: new Date(expiry) } : {}),
          ...(checked ? { checked: !!(parseInt(checked) || checked === "true") } : {}),
          ...(quantityToBuy ? { quantityToBuy: parseInt(quantityToBuy) } : {})
        };
        
        items.push(item);
      }

      this.inventoryService.importInventory(items);
      window.alert("Inventory was imported successfully!");
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
