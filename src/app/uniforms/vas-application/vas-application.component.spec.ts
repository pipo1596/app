import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VasApplicationComponent } from './vas-application.component';

describe('VasApplicationComponent', () => {
  let component: VasApplicationComponent;
  let fixture: ComponentFixture<VasApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VasApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VasApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
