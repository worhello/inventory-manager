import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySearchInput } from './inventory-search-input';

describe('InventorySearchInput', () => {
  let component: InventorySearchInput;
  let fixture: ComponentFixture<InventorySearchInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventorySearchInput],
    }).compileComponents();

    fixture = TestBed.createComponent(InventorySearchInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
