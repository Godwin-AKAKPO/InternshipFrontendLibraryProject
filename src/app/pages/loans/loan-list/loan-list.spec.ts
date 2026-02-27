import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanList } from './loan-list';

describe('LoanList', () => {
  let component: LoanList;
  let fixture: ComponentFixture<LoanList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanList],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
