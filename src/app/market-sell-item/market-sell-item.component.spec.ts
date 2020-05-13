import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketSellItemComponent } from './market-sell-item.component';

describe('MarketSellItemComponent', () => {
  let component: MarketSellItemComponent;
  let fixture: ComponentFixture<MarketSellItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketSellItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketSellItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
