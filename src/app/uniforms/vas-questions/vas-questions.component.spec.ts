import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VasQuestionsComponent } from './vas-questions.component';

describe('VasQuestionsComponent', () => {
  let component: VasQuestionsComponent;
  let fixture: ComponentFixture<VasQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VasQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VasQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
