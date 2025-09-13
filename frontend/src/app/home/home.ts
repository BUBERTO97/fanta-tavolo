import { Component, OnInit, inject } from '@angular/core';
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

  ngOnInit() {
    this.voters$ = this.gameService.getVoters();
  }
}
