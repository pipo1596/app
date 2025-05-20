import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniformComponent } from './uniform.component';

describe('UniformComponent', () => {
  let component: UniformComponent;
  let fixture: ComponentFixture<UniformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UniformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
