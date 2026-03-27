import { Component } from '@angular/core';
import { InventoryService } from '../inventory-service';

@Component({
  selector: 'app-shopping-view',
  imports: [],
  templateUrl: './shopping-view.html',
  styleUrl: './shopping-view.css',
})
export class ShoppingView {
  constructor(private inventoryService: InventoryService) {
    //
  }
}
