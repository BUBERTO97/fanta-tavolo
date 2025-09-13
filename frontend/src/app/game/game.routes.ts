import { Routes } from '@angular/router';
import {PredictionComponent} from './prediction/prediction';

export const GAME_ROUTES: Routes = [
  {
    path: 'predict',
    component: PredictionComponent,
  },
  {
    path: '',
    redirectTo: 'predict',
    pathMatch: 'full',
  },
];
