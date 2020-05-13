import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxRecordComponent } from './tax-record.component';

describe('TaxRecordComponent', () => {
  let component: TaxRecordComponent;
  let fixture: ComponentFixture<TaxRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
