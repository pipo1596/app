import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamtrackComponent } from './samtrack.component';

describe('SamtrackComponent', () => {
  let component: SamtrackComponent;
  let fixture: ComponentFixture<SamtrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SamtrackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamtrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
