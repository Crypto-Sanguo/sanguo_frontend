import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerRecycleComponent } from './player-recycle.component';

describe('PlayerRecycleComponent', () => {
  let component: PlayerRecycleComponent;
  let fixture: ComponentFixture<PlayerRecycleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerRecycleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerRecycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
