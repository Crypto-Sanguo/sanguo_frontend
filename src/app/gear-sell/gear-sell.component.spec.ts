import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GearSellComponent } from './gear-sell.component';

describe('GearSellComponent', () => {
  let component: GearSellComponent;
  let fixture: ComponentFixture<GearSellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GearSellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GearSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
