import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, provideNativeDateAdapter} from '@angular/material/core';
import { InventoryItem } from '../models/model';
import { InventoryService } from '../../inventory-service';

@Component({
  selector: 'app-inventory-item-edit',
  providers: [provideNativeDateAdapter(), {provide: MAT_DATE_FORMATS , useValue: MAT_NATIVE_DATE_FORMATS},],
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatDialogModule],
  templateUrl: './inventory-item-edit.html',
  styleUrl: './inventory-item-edit.css',
})
export class InventoryItemEdit {
  item: InventoryItem;

  constructor(private inventoryService: InventoryService, 
    @Inject(MAT_DIALOG_DATA) data: InventoryItem | undefined,
    private dialogRef: MatDialogRef<InventoryItemEdit>) {
    this.item = data ? structuredClone(data) : {id: "", quantity: 0, name: "", minQuantity: 0, category: ""};
  }

  save() {
    this.dialogRef.close(this.item);
  }
  
  cancel() {
    this.dialogRef.close();
  }
}
