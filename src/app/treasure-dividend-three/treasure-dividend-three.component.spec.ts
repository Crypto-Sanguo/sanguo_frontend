import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasureDividendThreeComponent } from './treasure-dividend-three.component';

describe('TreasureDividendThreeComponent', () => {
  let component: TreasureDividendThreeComponent;
  let fixture: ComponentFixture<TreasureDividendThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasureDividendThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasureDividendThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
