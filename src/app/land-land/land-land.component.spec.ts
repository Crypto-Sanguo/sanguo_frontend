import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandLandComponent } from './land-land.component';

describe('LandLandComponent', () => {
  let component: LandLandComponent;
  let fixture: ComponentFixture<LandLandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandLandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandLandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
