import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameService } from '../game/game.service';
import {from, map} from 'rxjs';

export const resultsGuard: CanActivateFn = (route, state) => {
  const gameService = inject(GameService);
  const router = inject(Router);

  return from(gameService.doesLeaderboardExist()).pipe(
    map(exists => {
      if (exists) {
        return true;
      }
      alert("I risultati non sono ancora disponibili!");
      return router.createUrlTree(['/']);
    })
  );
};
