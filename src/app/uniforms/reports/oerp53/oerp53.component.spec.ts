import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OERP53Component } from './oerp53.component';

describe('OERP53Component', () => {
  let component: OERP53Component;
  let fixture: ComponentFixture<OERP53Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OERP53Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OERP53Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
