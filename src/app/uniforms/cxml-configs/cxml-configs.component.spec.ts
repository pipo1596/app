import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CxmlConfigsComponent } from './cxml-configs.component';

describe('CxmlConfigsComponent', () => {
  let component: CxmlConfigsComponent;
  let fixture: ComponentFixture<CxmlConfigsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CxmlConfigsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CxmlConfigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
