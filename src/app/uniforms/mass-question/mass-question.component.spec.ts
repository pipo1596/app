import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassQuestionComponent } from './mass-question.component';

describe('MassQuestionComponent', () => {
  let component: MassQuestionComponent;
  let fixture: ComponentFixture<MassQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MassQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MassQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
