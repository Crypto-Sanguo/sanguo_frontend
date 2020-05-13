import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasureDividendOneComponent } from './treasure-dividend-one.component';

describe('TreasureDividendOneComponent', () => {
  let component: TreasureDividendOneComponent;
  let fixture: ComponentFixture<TreasureDividendOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasureDividendOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasureDividendOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
