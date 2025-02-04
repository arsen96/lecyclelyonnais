import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { PlanningModelService } from './planning-model.service';

describe('PlanningModelService', () => {
  let service: PlanningModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
      ],
    });
    service = TestBed.inject(PlanningModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
