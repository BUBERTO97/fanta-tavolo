import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard';
import { publicGuard } from './core/public-guard';
import { HomeComponent } from './home/home';
import {adminGuard} from "./core/admin-guard";
import {resultsGuard} from "./core/results-guard";
import {ResultsComponent} from "./results/results";

export const routes: Routes = [
    {
        path: 'auth',
        canActivate: [publicGuard],
        loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
    },
    {
        path: 'game',
        canActivate: [authGuard],
        loadChildren: () => import('./game/game.routes').then((m) => m.GAME_ROUTES),
    },
    {
        path: 'admin',
        canActivate: [adminGuard],
        loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    {
        path: 'results',
        component: ResultsComponent,
        canActivate: [authGuard, resultsGuard]
    },
    {
        path: '',
        component: HomeComponent,
        canActivate: [authGuard],
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: '',
    },
];
