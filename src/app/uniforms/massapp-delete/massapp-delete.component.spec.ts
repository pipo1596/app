import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassappDeleteComponent } from './massapp-delete.component';

describe('MassappDeleteComponent', () => {
  let component: MassappDeleteComponent;
  let fixture: ComponentFixture<MassappDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MassappDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MassappDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
