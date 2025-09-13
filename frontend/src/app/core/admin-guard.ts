import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { map, take } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAdmin().pipe(
    take(1),
    map(isAdmin => {
      if (isAdmin) {
        return true;
      }
      return router.createUrlTree(['/']);
    })
  );
};
