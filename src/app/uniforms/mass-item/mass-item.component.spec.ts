import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassItemComponent } from './mass-item.component';

describe('MassItemComponent', () => {
  let component: MassItemComponent;
  let fixture: ComponentFixture<MassItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MassItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MassItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
