import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { InventoryService } from '../inventory-service';
import { FormsModule } from '@angular/forms';
import { InventoryItem } from '../shared/models/model';
import { InventoryItemEditTrigger } from '../shared/inventory-item-edit-trigger';

@Component({
  selector: 'app-shopping-view',
  imports: [FormsModule],
  templateUrl: './shopping-view.html',
  styleUrl: './shopping-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShoppingView {

  constructor(public inventoryService: InventoryService, 
    private inventoryItemEditTrigger: InventoryItemEditTrigger,
    private cdRef: ChangeDetectorRef) {
  }

  onItemChecked(item: InventoryItem) {
    item.checked = !item.checked;
    this.inventoryService.editItem(item);
  }

  addNewItem() {
    this.inventoryItemEditTrigger.openInventoryItemEdit(undefined, () => {
      this.cdRef.markForCheck();
    })
  }
}
