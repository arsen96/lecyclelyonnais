import { TestBed } from '@angular/core/testing';

import { PlanningModelService } from './planning-model.service';

describe('PlanningModelService', () => {
  let service: PlanningModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanningModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
