import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard';
import { publicGuard } from './core/public-guard';
import { HomeComponent } from './home/home';
import {adminGuard} from "./core/admin-guard";

export const routes: Routes = [
    {
        path: 'auth',
        canActivate: [publicGuard], // Gli utenti loggati non possono accedere a /auth
        loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
    },
    {
        path: 'game',
        canActivate: [authGuard], // Solo gli utenti loggati possono accedere a /game
        loadChildren: () => import('./game/game.routes').then((m) => m.GAME_ROUTES),
    },
    {
        path: 'admin',
        canActivate: [adminGuard], // Proteggi questa rotta con la guardia admin
        loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    {
        path: '',
        component: HomeComponent,
        canActivate: [authGuard], // La home è protetta
        pathMatch: 'full',
    },
    {
        // Reindirizza tutte le altre rotte non valide alla home
        path: '**',
        redirectTo: '',
    },
];
