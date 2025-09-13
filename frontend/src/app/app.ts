import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Fanta Tavolo');
  private readonly authService = inject(AuthService);

  // Convertiamo gli observables dal servizio in segnali
  // In questo modo il template si aggiornerà automaticamente
  user = toSignal(this.authService.user$);
  isAdmin = toSignal(this.authService.isAdmin());

  logout() {
    this.authService.logout();
  }
}
