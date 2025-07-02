import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OERP302Component } from './oerp302.component';

describe('OERP302Component', () => {
  let component: OERP302Component;
  let fixture: ComponentFixture<OERP302Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OERP302Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OERP302Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
