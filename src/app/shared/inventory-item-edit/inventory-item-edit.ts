import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { AsyncPipe } from '@angular/common';
import { InventoryService } from '../services/inventory-service/inventory-service';

@Component({
  selector: 'app-inventory-item-edit',
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
  imports: [
    AsyncPipe,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './inventory-item-edit.html',
  styleUrl: './inventory-item-edit.scss',
})
export class InventoryItemEdit {
  private dialogRef = inject<MatDialogRef<InventoryItemEdit>>(MatDialogRef);
  inventoryService = inject(InventoryService);

  @ViewChild('categoryInput') input: ElementRef = {} as ElementRef;

  item: InventoryItem;
  title: string;

  form: FormGroup;

  constructor() {
    const data = inject<InventoryItem | undefined>(MAT_DIALOG_DATA);

    if (data) {
      this.item = structuredClone(data);
      this.title = 'Edit Inventory Item';
    } else {
      this.item = { id: '', quantity: 0, name: '', minQuantity: 0, category: '' };
      this.title = 'Create Inventory Item';
    }

    this.form = new FormGroup({
      name: new FormControl(this.item.name, [Validators.required]),
      quantity: new FormControl(this.item.quantity, [Validators.required]),
      minQuantity: new FormControl(this.item.minQuantity, [Validators.required]),
      category: new FormControl(this.item.category, [Validators.required]),
      expiry: new FormControl(this.item.expiry, []),
      // these fields are required to update the right items, but need to be hidden
      id: new FormControl(this.item.id, []),
      checked: new FormControl(this.item.checked, []),
      quantityToBuy: new FormControl(this.item.quantityToBuy, []),
    });
  }

  onCategorySelected() {
    this.input.nativeElement.blur();
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
