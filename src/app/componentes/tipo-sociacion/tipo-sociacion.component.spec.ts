import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoSociacionComponent } from './tipo-sociacion.component';

describe('TipoSociacionComponent', () => {
  let component: TipoSociacionComponent;
  let fixture: ComponentFixture<TipoSociacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoSociacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoSociacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
