import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GearMountComponent } from './gear-mount.component';

describe('GearMountComponent', () => {
  let component: GearMountComponent;
  let fixture: ComponentFixture<GearMountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GearMountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GearMountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
