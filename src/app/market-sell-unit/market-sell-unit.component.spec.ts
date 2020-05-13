import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketSellUnitComponent } from './market-sell-unit.component';

describe('MarketSellUnitComponent', () => {
  let component: MarketSellUnitComponent;
  let fixture: ComponentFixture<MarketSellUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketSellUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketSellUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
