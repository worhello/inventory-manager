import { TestBed } from '@angular/core/testing';

import { InventoryItemEditTrigger } from './inventory-item-edit-trigger';

describe('InventoryItemEditTrigger', () => {
  let service: InventoryItemEditTrigger;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryItemEditTrigger);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
