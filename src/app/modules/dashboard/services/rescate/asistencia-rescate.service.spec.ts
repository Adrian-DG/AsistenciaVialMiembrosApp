import { TestBed } from '@angular/core/testing';

import { AsistenciaRescateService } from './asistencia-rescate.service';

describe('AsistenciaRescateService', () => {
  let service: AsistenciaRescateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsistenciaRescateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
