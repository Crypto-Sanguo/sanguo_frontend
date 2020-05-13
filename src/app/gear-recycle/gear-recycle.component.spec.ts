import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GearRecycleComponent } from './gear-recycle.component';

describe('GearRecycleComponent', () => {
  let component: GearRecycleComponent;
  let fixture: ComponentFixture<GearRecycleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GearRecycleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GearRecycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
