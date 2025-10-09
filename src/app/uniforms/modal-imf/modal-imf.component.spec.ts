import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImfComponent } from './modal-imf.component';

describe('ModalImfComponent', () => {
  let component: ModalImfComponent;
  let fixture: ComponentFixture<ModalImfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalImfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalImfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
