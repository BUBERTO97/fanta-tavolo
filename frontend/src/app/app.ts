import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
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
  protected readonly title = signal('Fanta E-💨(vento)');
  private readonly authService = inject(AuthService);

  private readonly jokes = [
    'Hello World! 👋 In questa applicazione sono nascosti diversi Easter Eggs... Un piccolo indizio? Controlla anche i display: "none" ;)',
    "Ci sono 10 tipi di persone al mondo: quelle che capiscono il binario e quelle che non lo capiscono.",
    "Sorpresa! 🤯Jiale lavora al Tesake Sushi.🤯",
    "In verità Diego (aka Siego) è Silvia con i baffi 🧔🏼‍♀️.",
    "Amo premere f5, è così rinfrescante!",
    'Qual’è la più grande bugia dell’universo? ”Ho letto e accetto i termini e le condizioni” (tranne per l\'Alby nazionale)'
  ];

  currentJoke = signal(this.jokes[0]);

  user = toSignal(this.authService.user$);
  isAdmin = toSignal(this.authService.isAdmin());

  logout() {
    this.authService.logout();
  }

  jokeClick(){
    const randomIndex = Math.floor(Math.random() * this.jokes.length);
    this.currentJoke.set(this.jokes[randomIndex]);
  }
}
