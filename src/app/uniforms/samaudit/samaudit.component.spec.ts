import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamauditComponent } from './samaudit.component';

describe('SamauditComponent', () => {
  let component: SamauditComponent;
  let fixture: ComponentFixture<SamauditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SamauditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamauditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
