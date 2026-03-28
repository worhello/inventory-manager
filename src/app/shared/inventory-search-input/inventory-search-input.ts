import { Component, output, inject, ViewChild, ElementRef } from '@angular/core';
import { InventoryItem } from '../models/model';
import { InventoryService } from '../../inventory-service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe } from '@angular/common';
import { first } from 'rxjs';

@Component({
  selector: 'app-inventory-search-input',
  imports: [AsyncPipe, FormsModule, MatFormFieldModule, MatInputModule],
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

    this.inventoryService.searchByName(itemName).pipe(first()).subscribe((inventoryItem: InventoryItem | undefined) => {
      if (inventoryItem) {
        this.inventoryItemSelected.emit(inventoryItem);
      } else {
        this.newInventoryItemSelected.emit(itemName);
      }
    });
  }
}
