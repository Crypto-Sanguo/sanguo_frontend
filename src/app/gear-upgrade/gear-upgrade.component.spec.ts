import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GearUpgradeComponent } from './gear-upgrade.component';

describe('GearUpgradeComponent', () => {
  let component: GearUpgradeComponent;
  let fixture: ComponentFixture<GearUpgradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GearUpgradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GearUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
