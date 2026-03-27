import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookingView } from './cooking-view';

describe('CookingView', () => {
  let component: CookingView;
  let fixture: ComponentFixture<CookingView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookingView],
    }).compileComponents();

    fixture = TestBed.createComponent(CookingView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
