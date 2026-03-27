import { Component } from '@angular/core';
import { InventoryService } from '../inventory-service';

@Component({
  selector: 'app-inventory-view',
  imports: [],
  templateUrl: './inventory-view.html',
  styleUrl: './inventory-view.css',
})
export class InventoryView {

  constructor(public inventoryService: InventoryService) {
    //
  }
}
