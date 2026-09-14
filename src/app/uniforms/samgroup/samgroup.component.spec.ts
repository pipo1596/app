import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamgroupComponent } from './samgroup.component';

describe('SamgroupComponent', () => {
  let component: SamgroupComponent;
  let fixture: ComponentFixture<SamgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SamgroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
