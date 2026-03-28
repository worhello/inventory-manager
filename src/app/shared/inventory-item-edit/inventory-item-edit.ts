import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { InventoryItem } from '../models/model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-inventory-item-edit',
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './inventory-item-edit.html',
  styleUrl: './inventory-item-edit.scss',
})
export class InventoryItemEdit {
  private dialogRef = inject<MatDialogRef<InventoryItemEdit>>(MatDialogRef);

  item: InventoryItem;
  title: string;

  constructor() {
    const data = inject<InventoryItem | undefined>(MAT_DIALOG_DATA);

    if (data) {
      this.item = structuredClone(data);
      this.title = 'Edit Inventory Item';
    } else {
      this.item = { id: '', quantity: 0, name: '', minQuantity: 0, category: '' };
      this.title = 'Create Inventory Item';
    }
  }

  save() {
    this.dialogRef.close(this.item);
  }

  cancel() {
    this.dialogRef.close();
  }
}
