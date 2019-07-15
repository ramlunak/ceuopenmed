import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAnatomiaComponent } from './form-anatomia.component';

describe('FormAnatomiaComponent', () => {
  let component: FormAnatomiaComponent;
  let fixture: ComponentFixture<FormAnatomiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAnatomiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAnatomiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
