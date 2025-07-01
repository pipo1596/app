import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CxmlCustomerComponent } from './cxml-customer.component';

describe('CxmlCustomerComponent', () => {
  let component: CxmlCustomerComponent;
  let fixture: ComponentFixture<CxmlCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CxmlCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CxmlCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
