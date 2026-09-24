import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniformLayoutComponent } from './uniform-layout.component';

describe('UniformLayoutComponent', () => {
  let component: UniformLayoutComponent;
  let fixture: ComponentFixture<UniformLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UniformLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniformLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
