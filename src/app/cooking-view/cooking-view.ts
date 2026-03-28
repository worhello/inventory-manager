import { Component, inject } from '@angular/core';
import { InventorySearchInput } from '../shared/inventory-search-input/inventory-search-input';
import { InventoryItem } from '../shared/models/model';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { InventoryService } from '../shared/services/inventory-service/inventory-service';

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
  imports: [FormsModule, InventorySearchInput, MatButtonModule, MatInputModule],
  templateUrl: './cooking-view.html',
  styleUrl: './cooking-view.scss',
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
    this.resetItemsToBeRemoved();
  }

  resetItemsToBeRemoved() {
    this.itemsToBeRemoved.length = 0;
    this.itemsToBeRemoved = [new RemovedItem()];
  }
}
