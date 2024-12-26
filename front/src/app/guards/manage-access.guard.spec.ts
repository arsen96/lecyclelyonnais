import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { manageAccessGuard } from './manage-access.guard';

describe('manageAccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => manageAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
