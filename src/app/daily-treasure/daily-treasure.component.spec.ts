import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTreasureComponent } from './daily-treasure.component';

describe('DailyTreasureComponent', () => {
  let component: DailyTreasureComponent;
  let fixture: ComponentFixture<DailyTreasureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyTreasureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyTreasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
