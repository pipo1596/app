import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassappUpdateComponent } from './massapp-update.component';

describe('MassappUpdateComponent', () => {
  let component: MassappUpdateComponent;
  let fixture: ComponentFixture<MassappUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MassappUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MassappUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
