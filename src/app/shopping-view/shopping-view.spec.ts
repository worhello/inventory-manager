import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingView } from './shopping-view';

describe('ShoppingView', () => {
  let component: ShoppingView;
  let fixture: ComponentFixture<ShoppingView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingView],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
