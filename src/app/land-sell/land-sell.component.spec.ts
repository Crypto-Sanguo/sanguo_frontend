import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandSellComponent } from './land-sell.component';

describe('LandSellComponent', () => {
  let component: LandSellComponent;
  let fixture: ComponentFixture<LandSellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandSellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
