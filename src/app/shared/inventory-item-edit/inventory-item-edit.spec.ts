import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryItemEdit } from './inventory-item-edit';

describe('InventoryItemEdit', () => {
  let component: InventoryItemEdit;
  let fixture: ComponentFixture<InventoryItemEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryItemEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryItemEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
