import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasureRulesComponent } from './treasure-rules.component';

describe('TreasureRulesComponent', () => {
  let component: TreasureRulesComponent;
  let fixture: ComponentFixture<TreasureRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasureRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasureRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
