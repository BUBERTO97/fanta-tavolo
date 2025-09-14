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
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('Fanta E-💨');
  private readonly authService = inject(AuthService);
  private jokeInterval: any;

  // Lista di barzellette da mostrare
  private readonly jokes = [
    "Qual è il social network preferito dai ragni? Il Web.",
    "Un programmatore muore e va all'inferno. Dopo una settimana, Lucifero chiama Dio: 'Cosa mi hai mandato? Ha automatizzato le caldaie, riscritto il sistema in Python e ora c'è l'aria condizionata!'",
    "Ci sono 10 tipi di persone al mondo: quelle che capiscono il binario e quelle che non lo capiscono.",
    "Perché i programmatori confondono sempre Halloween con Natale? Perché Oct 31 == Dec 25.",
    "Un programmatore mette due bicchieri sul comodino prima di dormire: uno pieno d'acqua nel caso avesse sete, e uno vuoto nel caso non l'avesse.",
    "Cosa dice un programmatore quando esce dalla doccia? 'Hello, World!'",
  ];

  currentJoke = signal(this.jokes[0]);

  user = toSignal(this.authService.user$);
  isAdmin = toSignal(this.authService.isAdmin());

  ngOnInit() {
    // Cambia la barzelletta ogni 10 secondi
    this.jokeInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * this.jokes.length);
      this.currentJoke.set(this.jokes[randomIndex]);
    }, 30000);
  }

  ngOnDestroy() {
    // Pulisce l'intervallo per evitare memory leak quando il componente viene distrutto
    if (this.jokeInterval) {
      clearInterval(this.jokeInterval);
    }
  }

  logout() {
    this.authService.logout();
  }
}
