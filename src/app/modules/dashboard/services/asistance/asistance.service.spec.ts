import { TestBed } from '@angular/core/testing';

import { AsistanceService } from './asistance.service';

describe('AsistanceService', () => {
  let service: AsistanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsistanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
