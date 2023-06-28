import { TestBed } from '@angular/core/testing';

import { ResponsabilidadService } from './responsabilidad.service';

describe('ResponsabilidadService', () => {
  let service: ResponsabilidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsabilidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
