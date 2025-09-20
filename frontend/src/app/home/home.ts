import {Component, OnInit, inject, ElementRef, ViewChild} from '@angular/core';
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


  voters$!: Observable<Pronostico[]>;


  showEasterEggMessage = false;

  private readonly EASTER_EGG_MESSAGE_DURATION = 10000; // 10 secondi



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

}
