import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VasCustomizationComponent } from './vas-customization.component';

describe('VasCustomizationComponent', () => {
  let component: VasCustomizationComponent;
  let fixture: ComponentFixture<VasCustomizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VasCustomizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VasCustomizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
