import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerTeamComponent } from './player-team.component';

describe('PlayerTeamComponent', () => {
  let component: PlayerTeamComponent;
  let fixture: ComponentFixture<PlayerTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
