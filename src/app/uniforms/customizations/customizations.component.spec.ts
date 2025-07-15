import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizationsComponent } from './customizations.component';

describe('CustomizationsComponent', () => {
  let component: CustomizationsComponent;
  let fixture: ComponentFixture<CustomizationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomizationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
