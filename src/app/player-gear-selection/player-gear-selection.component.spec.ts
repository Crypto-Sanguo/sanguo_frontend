import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerGearSelectionComponent } from './player-gear-selection.component';

describe('PlayerGearSelectionComponent', () => {
  let component: PlayerGearSelectionComponent;
  let fixture: ComponentFixture<PlayerGearSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerGearSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerGearSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
