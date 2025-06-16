import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaChildComponent } from './na-child.component';

describe('NaChildComponent', () => {
  let component: NaChildComponent;
  let fixture: ComponentFixture<NaChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NaChildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
