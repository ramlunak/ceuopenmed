import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSintomaComponent } from './form-sintoma.component';

describe('FormSintomaComponent', () => {
  let component: FormSintomaComponent;
  let fixture: ComponentFixture<FormSintomaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSintomaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSintomaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
