import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasureDividendTwoComponent } from './treasure-dividend-two.component';

describe('TreasureDividendTwoComponent', () => {
  let component: TreasureDividendTwoComponent;
  let fixture: ComponentFixture<TreasureDividendTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasureDividendTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasureDividendTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
