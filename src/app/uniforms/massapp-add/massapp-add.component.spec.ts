import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassappAddComponent } from './massapp-add.component';

describe('MassappAddComponent', () => {
  let component: MassappAddComponent;
  let fixture: ComponentFixture<MassappAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MassappAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MassappAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
