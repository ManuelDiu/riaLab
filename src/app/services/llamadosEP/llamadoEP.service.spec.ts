import { TestBed } from '@angular/core/testing';

import { LlamadoEPService } from './llamadoEP.service';

describe('LlamadosEPService', () => {
  let service: LlamadoEPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LlamadoEPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
