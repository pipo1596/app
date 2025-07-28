import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VasQuestionComponent } from './vas-question.component';

describe('VasQuestionComponent', () => {
  let component: VasQuestionComponent;
  let fixture: ComponentFixture<VasQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VasQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VasQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
