import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAsociacionesComponent } from './lista-asociaciones.component';

describe('ListaAsociacionesComponent', () => {
  let component: ListaAsociacionesComponent;
  let fixture: ComponentFixture<ListaAsociacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaAsociacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaAsociacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
