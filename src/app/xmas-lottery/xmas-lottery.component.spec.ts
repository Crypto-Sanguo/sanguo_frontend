import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmasLotteryComponent } from './xmas-lottery.component';

describe('XmasLotteryComponent', () => {
  let component: XmasLotteryComponent;
  let fixture: ComponentFixture<XmasLotteryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XmasLotteryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XmasLotteryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
