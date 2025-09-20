import {Component, OnInit, inject, effect, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { GameService } from '../game.service';
import {Invitato, Pronostico} from '../game.models';
import {startWith, switchMap, take} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-prediction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './prediction.html',
  styleUrl: './prediction.scss'
})
export class PredictionComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly gameService = inject(GameService);

  // Form principale
  predictionForm: FormGroup;
  invitati = toSignal(this.gameService.getInvitati(), { initialValue: [] });
  formeTavolo = ['tondo', 'rettangolare', 'ferro di cavallo'];

  activeTooltip: { tableIndex: number; seatIndex: number } | null = null;

  gameSettings = toSignal(this.gameService.getGameSettings());


  private tavoliValue = toSignal(
    this.fb.array([]).valueChanges.pipe(startWith([]))
  );

  selectedInvitatiIds = computed(() => {
    const selectedIds = new Set<string>();
    const tavoli = this.tavoliValue() || [];
    tavoli.forEach((tavolo: any) => {
      tavolo.posti?.forEach((posto: any) => {
        if (posto?.invitatoId) {
          selectedIds.add(posto.invitatoId);
        }
      });
    });
    return selectedIds;
  });

  constructor() {
    this.predictionForm = this.fb.group({
      tavoli: this.fb.array([])
    });

    this.tavoliValue = toSignal(
      this.predictionForm.get('tavoli')!.valueChanges.pipe(
        startWith(this.predictionForm.get('tavoli')!.value)
      )
    );

    effect(() => {
      const locked = this.gameSettings()?.predictionsLocked;
      if (locked === true) {
        this.predictionForm.disable();
      } else if (locked === false) {
        this.predictionForm.enable();
      }
    });
  }

  ngOnInit() {
    this.loadOrCreatePronostico();
  }

  getAvailableInvitatiForSeat(tableIndex: number, seatIndex: number): Invitato[] {
    const allInvitati = this.invitati();
    const selectedIds = this.selectedInvitatiIds();
    const currentSeatValue = this.posti(tableIndex).at(seatIndex)?.value?.invitatoId;

    return allInvitati
      .filter(invitato => !selectedIds.has(invitato.id) || invitato.id === currentSeatValue)
      .sort((a, b) => {
        const cognomeCompare = a.cognome.localeCompare(b.cognome, undefined, { sensitivity: 'base' });
        if (cognomeCompare !== 0) {
          return cognomeCompare;
        }
        return a.nome.localeCompare(b.nome, undefined, { sensitivity: 'base' });
      });
  }

  getInvitatoById(id: string): Invitato | undefined {
    return this.invitati().find(inv => inv.id === id);
  }

  loadOrCreatePronostico() {
    this.authService.user$.pipe(
      take(1),
      switchMap(user => {
        if (!user) return Promise.resolve(null);
        return this.gameService.getPronostico(user.uid);
      })
    ).subscribe(pronostico => {
      this.tavoli.clear();
      if (pronostico && pronostico.tavoli.length > 0) {
        pronostico.tavoli.forEach(tavolo => {
          this.tavoli.push(this.creaTavoloFormGroup(tavolo));
        });
      } else {
        this.aggiungiTavolo();
      }
    });
  }

  toggleTooltip(event: MouseEvent, tableIndex: number, seatIndex: number) {
    event.stopPropagation();
    if (this.isTooltipActive(tableIndex, seatIndex)) {
      this.activeTooltip = null;
    } else {
      this.activeTooltip = { tableIndex, seatIndex };
    }
  }

  isTooltipActive(tableIndex: number, seatIndex: number): boolean {
    return this.activeTooltip?.tableIndex === tableIndex && this.activeTooltip?.seatIndex === seatIndex;
  }

  closeTooltip() {
    this.activeTooltip = null;
  }

  get tavoli(): FormArray {
    return this.predictionForm.get('tavoli') as FormArray;
  }

  creaPosto(invitatoId: string | null = null): FormGroup {
    return this.fb.group({
      invitatoId: [invitatoId]
    });
  }

  creaTavoloFormGroup(tavoloData?: any): FormGroup {
    const postiArray = this.fb.array(
      tavoloData?.posti.map((p: any) => this.creaPosto(p.invitatoId)) || []
    );

    return this.fb.group({
      forma: [tavoloData?.forma || 'tondo', Validators.required],
      posti: postiArray
    });
  }

  aggiungiTavolo() {
    this.tavoli.push(this.creaTavoloFormGroup());
  }

  aggiungiPosto(indexTavolo: number) {
    this.posti(indexTavolo).push(this.creaPosto());
  }

  rimuoviPosto(indexTavolo: number, indexPosto: number) {
    this.posti(indexTavolo).removeAt(indexPosto);
  }

  rimuoviTavolo(index: number) {
    this.tavoli.removeAt(index);
  }

  posti(indexTavolo: number): FormArray {
    return this.tavoli.at(indexTavolo).get('posti') as FormArray;
  }

  onSubmit() {
    if (this.predictionForm.invalid) return;

    this.authService.user$.pipe(take(1)).subscribe(user => {
      if (user && user.email) {
        const pronostico = {
          userId: user.uid,
          userEmail: user.email,
          tavoli: this.predictionForm.value.tavoli
        };
        this.gameService.savePronostico(user.uid, pronostico)
          .then(() => alert('Pronostico salvato con successo!'))
          .catch(err => console.error('Errore nel salvataggio:', err));
      }
    });
  }
}
