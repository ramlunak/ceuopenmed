import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorAsociacionesMultiplesComponent } from './visor-asociaciones-multiples.component';

describe('VisorAsociacionesMultiplesComponent', () => {
  let component: VisorAsociacionesMultiplesComponent;
  let fixture: ComponentFixture<VisorAsociacionesMultiplesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisorAsociacionesMultiplesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisorAsociacionesMultiplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
