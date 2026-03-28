import { Component, output, inject, ViewChild, ElementRef } from '@angular/core';
import { InventoryItem } from '../models/model';
import { InventoryService } from '../../inventory-service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-inventory-search-input',
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './inventory-search-input.html',
  styleUrl: './inventory-search-input.css',
})
export class InventorySearchInput {
  inventoryService = inject(InventoryService);

  inventoryItemSelected = output<InventoryItem>();
  newInventoryItemSelected = output<string>();

  @ViewChild('inventoryInput') input: ElementRef = {} as ElementRef;

  onInventoryItemSelected(itemName: string) {
    this.input.nativeElement.blur();

    const inventoryItem = this.inventoryService.searchByName(itemName);
    if (inventoryItem) {
      this.inventoryItemSelected.emit(inventoryItem);
    } else {
      this.newInventoryItemSelected.emit(itemName);
    }
  }
}
