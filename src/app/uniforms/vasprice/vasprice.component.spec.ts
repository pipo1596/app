import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaspriceComponent } from './vasprice.component';

describe('VaspriceComponent', () => {
  let component: VaspriceComponent;
  let fixture: ComponentFixture<VaspriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VaspriceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VaspriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
