import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasureDividendFourComponent } from './treasure-dividend-four.component';

describe('TreasureDividendFourComponent', () => {
  let component: TreasureDividendFourComponent;
  let fixture: ComponentFixture<TreasureDividendFourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasureDividendFourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasureDividendFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
