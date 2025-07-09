import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OEUL36Component } from './oeul36.component';

describe('OEUL36Component', () => {
  let component: OEUL36Component;
  let fixture: ComponentFixture<OEUL36Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OEUL36Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OEUL36Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
