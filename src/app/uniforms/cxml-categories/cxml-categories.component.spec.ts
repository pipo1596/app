import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CxmlCategoriesComponent } from './cxml-categories.component';

describe('CxmlCategoriesComponent', () => {
  let component: CxmlCategoriesComponent;
  let fixture: ComponentFixture<CxmlCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CxmlCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CxmlCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
