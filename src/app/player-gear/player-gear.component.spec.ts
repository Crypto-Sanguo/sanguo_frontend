import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerGearComponent } from './player-gear.component';

describe('PlayerGearComponent', () => {
  let component: PlayerGearComponent;
  let fixture: ComponentFixture<PlayerGearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerGearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerGearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
