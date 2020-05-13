import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GearSynthesiseComponent } from './gear-synthesise.component';

describe('GearSynthesiseComponent', () => {
  let component: GearSynthesiseComponent;
  let fixture: ComponentFixture<GearSynthesiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GearSynthesiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GearSynthesiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
