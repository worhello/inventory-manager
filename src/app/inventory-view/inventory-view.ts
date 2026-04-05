import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { InventoryItem } from '../shared/models/model';
import { InventoryItemEditTrigger } from '../shared/inventory-item-edit-trigger';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { InventoryService } from '../shared/services/inventory-service/inventory-service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-inventory-view',
  imports: [AsyncPipe, FormsModule, MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule, MatInputModule, MatFormFieldModule, MatTooltipModule],
  templateUrl: './inventory-view.html',
  styleUrl: './inventory-view.scss',
})
export class InventoryView {

  static readonly expiryWarningThresholdMs = 3 * 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds;

  inventoryService = inject(InventoryService);
  dialog = inject(MatDialog);
  inventoryItemEditTrigger = inject(InventoryItemEditTrigger);

  filteredInventory$: Observable<InventoryItem[]>;
  categories$: Observable<string[]>;

  searchQuery$ = new BehaviorSubject<string>('');

  constructor() {
    this.filteredInventory$ = this.inventoryService.inventory$;
    this.categories$ = this.inventoryService.categories$;
  }

  isExpiringSoon(item: InventoryItem): boolean {
    if (!item.expiry) {
      return false;
    }

    if (item.quantity <= 0) {
      return false;
    }
    
    const expiryTime = item.expiry.getTime();
    const warningThreshold = new Date().getTime() + InventoryView.expiryWarningThresholdMs; // today + expiryWarningThresholdMs(3) days
    return expiryTime < warningThreshold;
  }

  onSearchUpdated(newValue: string) {
    this.searchQuery$.next(newValue);
  }

  getFilteredInventory(category: string): Observable<InventoryItem[]> {
    return combineLatest([
      this.inventoryService.getInventoryWithFilter((item) => item.category === category),
      this.searchQuery$])
        .pipe(
          map(([categoryInventory, searchQuery]) => categoryInventory.filter(item => item.name.includes(searchQuery)))
        );
  }

  editItem(item: InventoryItem) {
    this.openInventoryItemEdit(item);
  }

  deleteItem(item: InventoryItem) {
    this.inventoryService.deleteItem(item.id);
  }

  addNewItem() {
    this.openInventoryItemEdit();
  }

  private openInventoryItemEdit(item?: InventoryItem) {
    this.inventoryItemEditTrigger.openInventoryItemEdit(item);
  }

  getAmountNeeded(item: InventoryItem) {
    return Math.max(item.minQuantity - item.quantity, 0);
  }
}
