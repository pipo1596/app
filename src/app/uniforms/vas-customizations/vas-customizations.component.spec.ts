import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VasCustomizationsComponent } from './vas-customizations.component';

describe('VasCustomizationsComponent', () => {
  let component: VasCustomizationsComponent;
  let fixture: ComponentFixture<VasCustomizationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VasCustomizationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VasCustomizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
