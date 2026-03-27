import { Component, inject } from '@angular/core';
import { InventorySearchInput } from '../shared/inventory-search-input/inventory-search-input';
import { InventoryItem } from '../shared/models/model';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../inventory-service';

class RemovedItem {
  id = '';
  quantity = 0;
  name = '';
  valid = true;

  isEmpty() {
    return this.id === '';
  }
}

@Component({
  selector: 'app-cooking-view',
  imports: [FormsModule, InventorySearchInput],
  templateUrl: './cooking-view.html',
  styleUrl: './cooking-view.css',
})
export class CookingView {
  private inventoryService = inject(InventoryService);

  itemsToBeRemoved: RemovedItem[] = [];

  constructor() {
    this.resetItemsToBeRemoved();
  }

  onInventoryItemSelected(item: RemovedItem, event: InventoryItem) {
    item.valid = true;
    item.id = event.id;
    item.name = event.name;
    if (!this.itemsToBeRemoved[this.itemsToBeRemoved.length - 1].isEmpty()) {
      this.itemsToBeRemoved.push(new RemovedItem());
    }
  }

  onInvalidItemSelected(item: RemovedItem) {
    item.valid = false;
  }

  onSubmit() {
    this.inventoryService.removeItems(this.itemsToBeRemoved);
  }

  resetItemsToBeRemoved() {
    this.itemsToBeRemoved = [new RemovedItem()];
  }
}
