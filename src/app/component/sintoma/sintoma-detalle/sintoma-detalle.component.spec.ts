import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SintomaDetalleComponent } from './sintoma-detalle.component';

describe('SintomaDetalleComponent', () => {
  let component: SintomaDetalleComponent;
  let fixture: ComponentFixture<SintomaDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SintomaDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SintomaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
