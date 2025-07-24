import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VasApplicationsComponent } from './vas-applications.component';

describe('VasAppplicationsComponent', () => {
  let component: VasApplicationsComponent;
  let fixture: ComponentFixture<VasApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VasApplicationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VasApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
