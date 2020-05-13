import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleRecordComponent } from './battle-record.component';

describe('BattleRecordComponent', () => {
  let component: BattleRecordComponent;
  let fixture: ComponentFixture<BattleRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
