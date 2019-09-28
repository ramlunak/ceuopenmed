import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoAsociacionMultipleComponent } from './tipo-asociacion-multiple.component';

describe('TipoAsociacionMultipleComponent', () => {
  let component: TipoAsociacionMultipleComponent;
  let fixture: ComponentFixture<TipoAsociacionMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoAsociacionMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoAsociacionMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
