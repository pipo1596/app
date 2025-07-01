import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OERP52Component } from './oerp52.component';

describe('OERP52Component', () => {
  let component: OERP52Component;
  let fixture: ComponentFixture<OERP52Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OERP52Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OERP52Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
