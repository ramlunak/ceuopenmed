import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTratamientoComponent } from './form-tratamiento.component';

describe('FormTratamientoComponent', () => {
  let component: FormTratamientoComponent;
  let fixture: ComponentFixture<FormTratamientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTratamientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTratamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
