import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GearCooldownComponent } from './gear-cooldown.component';

describe('GearCooldownComponent', () => {
  let component: GearCooldownComponent;
  let fixture: ComponentFixture<GearCooldownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GearCooldownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GearCooldownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
