import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AuthGuard } from './access-controls.guard';

describe('accessControlsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => AuthGuard());

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
