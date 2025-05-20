import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniformModalComponent } from './uniform-modal.component';

describe('UniformModalComponent', () => {
  let component: UniformModalComponent;
  let fixture: ComponentFixture<UniformModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UniformModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniformModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
