import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerFillEnergyComponent } from './player-fill-energy.component';

describe('PlayerFillEnergyComponent', () => {
  let component: PlayerFillEnergyComponent;
  let fixture: ComponentFixture<PlayerFillEnergyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerFillEnergyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerFillEnergyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
