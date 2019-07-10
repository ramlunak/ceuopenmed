import { TestBed } from '@angular/core/testing';

import { ServiceEnfermedadesService } from './service-enfermedades.service';

describe('ServiceEnfermedadesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceEnfermedadesService = TestBed.get(ServiceEnfermedadesService);
    expect(service).toBeTruthy();
  });
});
