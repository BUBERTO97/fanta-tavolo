import {Component, OnInit, inject, ElementRef, ViewChild, signal, effect} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GameService } from '../game/game.service';
import { Observable } from 'rxjs';
import { Pronostico } from '../game/game.models';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  private readonly gameService = inject(GameService);

  private readonly jokes = [
    'Hello World! 👋 In questa applicazione sono nascosti diversi Easter Eggs... Un piccolo indizio? Controlla anche i display: "none" ;)',
    "Sì, esatto, puoi cliccarmi ancora ed io cambierò per te...",
    "Cliccami ancora...",
    "Forza, cliccami ancora...",
    "Vai, continua così🫣...",
    "Ci sono 10 tipi di persone al mondo: quelle che capiscono il binario e quelle che non lo capiscono. Continua a cliccare...",
    "Sì, esatto, puoi cliccarmi ancora e ancora...",
    "Dai, ancora una volta...",
    "Sorpresa! 🤯Jiale lavora al Tesake Sushi.🤯",
    "In verità Diego (aka Siego) è Silvia con i baffi 🧔🏼‍♀️.",
    "Amo premere f5, è così rinfrescante!",
    'Qual’è la più grande bugia dell’universo? ”Ho letto e accetto i termini e le condizioni” (tranne per l\'Alby nazionale)'
  ];

  currentJoke = signal(this.jokes[0]);

  displayedJoke = signal('');

  private typingTimeout: any;
  private readonly typingSpeed = 75;


  voters$!: Observable<Pronostico[]>;


  showEasterEggMessage = false;

  private readonly EASTER_EGG_MESSAGE_DURATION = 5000; // 10 secondi


  constructor() {
    effect(() => {
      const jokeToDisplay = this.currentJoke(); // Read the signal to create a dependency
      this.startTypewriter(jokeToDisplay);
    });
  }

  private startTypewriter(text: string): void {
    // Clear any previous, unfinished animation
    clearTimeout(this.typingTimeout);
    this.displayedJoke.set(''); // Reset the displayed text

    let charIndex = 0;
    const type = () => {
      if (charIndex < text.length) {
        this.displayedJoke.update(currentText => currentText + text.charAt(charIndex));
        charIndex++;
        this.typingTimeout = setTimeout(type, this.typingSpeed);
      }
    };
    type(); // Start the typing
  }


  ngOnInit() {
    this.voters$ = this.gameService.getVoters();
  }

  triggerEasterEgg(): void {

    // 2. Mostra il messaggio
    this.showEasterEggMessage = true;

    // 3. Imposta un timer per nascondere il messaggio dopo il tempo definito
    setTimeout(() => {
      this.showEasterEggMessage = false;
    }, this.EASTER_EGG_MESSAGE_DURATION);
  }

  jokeClick(){
    const randomIndex = Math.floor(Math.random() * this.jokes.length);
    this.currentJoke.set(this.jokes[randomIndex]);
  }

}
