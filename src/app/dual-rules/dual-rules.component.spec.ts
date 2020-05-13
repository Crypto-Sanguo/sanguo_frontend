import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DualRulesComponent } from './dual-rules.component';

describe('DualRulesComponent', () => {
  let component: DualRulesComponent;
  let fixture: ComponentFixture<DualRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DualRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DualRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
