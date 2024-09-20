import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { accessControlsGuard } from './access-controls.guard';

describe('accessControlsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => accessControlsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
