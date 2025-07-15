import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassAppComponent } from './mass-app.component';

describe('MassAppComponent', () => {
  let component: MassAppComponent;
  let fixture: ComponentFixture<MassAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MassAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MassAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
