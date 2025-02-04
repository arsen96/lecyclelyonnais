import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { InterventionService } from './intervention.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('InterventionService', () => {
  let service: InterventionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(InterventionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
