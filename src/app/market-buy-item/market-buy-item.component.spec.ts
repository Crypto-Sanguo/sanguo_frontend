import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketBuyItemComponent } from './market-buy-item.component';

describe('MarketBuyItemComponent', () => {
  let component: MarketBuyItemComponent;
  let fixture: ComponentFixture<MarketBuyItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketBuyItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketBuyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
