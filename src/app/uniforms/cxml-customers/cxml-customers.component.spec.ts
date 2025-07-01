import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CxmlCustomersComponent } from './cxml-customers.component';

describe('CxmlCustomersComponent', () => {
  let component: CxmlCustomersComponent;
  let fixture: ComponentFixture<CxmlCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CxmlCustomersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CxmlCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
