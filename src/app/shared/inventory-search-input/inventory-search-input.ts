import { Component, output } from '@angular/core';
import { InventoryItem } from '../models/model';
import { InventoryService } from '../../inventory-service';

@Component({
  selector: 'app-inventory-search-input',
  imports: [],
  templateUrl: './inventory-search-input.html',
  styleUrl: './inventory-search-input.css',
})
export class InventorySearchInput {
  inventoryItemSelected = output<InventoryItem>();
  newInventoryItemSelected = output<string>();


  constructor(public inventoryService: InventoryService) {
    // TODO
  }

  onInventoryItemSelected(itemName: string) {
    const inventoryItem = this.inventoryService.searchByName(itemName);
    if (inventoryItem) {
      this.inventoryItemSelected.emit(inventoryItem);
    } else {
      this.newInventoryItemSelected.emit(itemName);
    }
  }
}
