import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketItemInfoComponent } from './market-item-info.component';

describe('MarketItemInfoComponent', () => {
  let component: MarketItemInfoComponent;
  let fixture: ComponentFixture<MarketItemInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketItemInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketItemInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
