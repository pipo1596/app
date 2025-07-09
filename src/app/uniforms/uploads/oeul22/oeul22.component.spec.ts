import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OEUL22Component } from './oeul22.component';

describe('OEUL22Component', () => {
  let component: OEUL22Component;
  let fixture: ComponentFixture<OEUL22Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OEUL22Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OEUL22Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
