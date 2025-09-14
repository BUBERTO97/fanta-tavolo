import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { GameService } from '../game/game.service';
import { Invitato } from '../game/game.models';
import {from} from 'rxjs';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.html',
  styleUrl: './results.scss'
})
export class ResultsComponent {
  private readonly authService = inject(AuthService);
  private readonly gameService = inject(GameService);

  currentUser = toSignal(this.authService.user$);
  leaderboard = toSignal(this.gameService.getLeaderboard(), { initialValue: [] });
  risultatiUfficiali = toSignal(from(this.gameService.getRisultatiUfficiali()));
  invitati = toSignal(this.gameService.getInvitati(), { initialValue: [] });

  personalResult = computed(() => {
    const user = this.currentUser();
    if (!user) return null;
    return this.leaderboard().find(entry => entry.userId === user.uid);
  });

  getInvitatoName(id: string): string {
    const invitato = this.invitati().find(i => i.id === id);
    return invitato ? `${invitato.nome} ${invitato.cognome}` : 'N/A';
  }
}
