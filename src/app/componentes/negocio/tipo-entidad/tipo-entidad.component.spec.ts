import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoEntidadComponent } from './tipo-entidad.component';

describe('TipoEntidadComponent', () => {
  let component: TipoEntidadComponent;
  let fixture: ComponentFixture<TipoEntidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoEntidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoEntidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
