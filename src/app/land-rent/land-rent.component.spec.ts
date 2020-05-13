import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandRentComponent } from './land-rent.component';

describe('LandRentComponent', () => {
  let component: LandRentComponent;
  let fixture: ComponentFixture<LandRentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandRentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandRentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
