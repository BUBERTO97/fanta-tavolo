import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GameService } from '../game/game.service';
import * as Papa from 'papaparse';
import { Invitato, Pronostico } from '../game/game.models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent implements OnInit {
  private readonly gameService = inject(GameService);
  private readonly fb = inject(FormBuilder);

  // --- Sezione Gestione Invitati ---
  showInvitatiTable = signal(false);
  parsedInvitati: Invitato[] = [];
  fileName: string | null = null;
  invitatiForm: FormGroup;
  invitati = toSignal(this.gameService.getInvitati(), { initialValue: [] });

  // --- Sezione Gestione Partita ---
  voters = toSignal(this.gameService.getVoters(), { initialValue: [] });
  risultatiForm: FormGroup;

  votiConfermatiSummary = computed(() => {
    const total = this.voters().length;
    if (total === 0) return "Nessun voto presente.";
    const confermati = this.voters().filter(v => v.confermato).length;
    return `${confermati} / ${total} voti confermati`;
  });

  gameSettings = toSignal(this.gameService.getGameSettings());


  constructor() {
    this.invitatiForm = this.fb.group({
      rows: this.fb.array([])
    });

    this.risultatiForm = this.fb.group({
      numeroTavoliCorretto: [1, [Validators.required, Validators.min(1)]],
      tavoli: this.fb.array([])
    });
  }

  ngOnInit() {
    this.gameService.getInvitati().subscribe(invitati => {
      this.populateInvitatiForm(invitati);
    });
  }

  // --- Metodi per Gestione Invitati ---

  populateInvitatiForm(invitati: Invitato[]) {
    this.invitatiRows.clear();
    invitati.forEach(invitato => {
      this.invitatiRows.push(this.fb.group({
        id: [invitato.id],
        nome: [invitato.nome, Validators.required],
        cognome: [invitato.cognome, Validators.required],
        company: [invitato.company || ''],
        plus1: [invitato.plus1 || '']
      }));
    });
  }

  get invitatiRows(): FormArray {
    return this.invitatiForm.get('rows') as FormArray;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          this.parsedInvitati = this.processCsvData(result.data);
        },
        error: (error) => console.error('Errore nel parsing:', error)
      });
    }
  }

  confirmUpload() {
    if (this.parsedInvitati.length === 0) {
      alert('Nessun dato valido da caricare.');
      return;
    }
    this.gameService.uploadInvitati(this.parsedInvitati)
      .then(() => {
        alert('Lista invitati caricata con successo!');
        this.parsedInvitati = [];
        this.fileName = null;
        (document.getElementById('invitati-file') as HTMLInputElement).value = '';
      })
      .catch(err => alert(`Errore durante il caricamento: ${err.message}`));
  }

  private processCsvData(data: any[]): Invitato[] {
    return data.map(row => ({
      id: row.id,
      nome: row.name,
      cognome: row.lastName,
      company: row.company,
      plus1: row.plus1 === '[NULL]' ? '' : row.plus1
    }));
  }

  saveTableChanges() {
    if (this.invitatiForm.invalid) {
      alert('Controlla i dati, alcuni campi non sono validi.');
      return;
    }
    const promises = this.invitatiRows.controls
      .filter(control => control.dirty)
      .map(control => {
        const invitato: Invitato = control.value;
        return this.gameService.updateInvitato(invitato);
      });

    Promise.all(promises)
      .then(() => {
        alert('Modifiche salvate con successo!');
        this.invitatiForm.markAsPristine();
      })
      .catch(err => alert(`Errore nel salvataggio: ${err.message}`));
  }

  // --- Metodi per Gestione Partita ---
  toggleConfermaVoto(voter: Pronostico) {
    const nuovoStato = !voter.confermato;
    this.gameService.confermaVoto(voter.userId, nuovoStato)
      .catch(err => alert(`Errore durante l'aggiornamento del voto: ${err.message}`));
  }

  get tavoliRisultati(): FormArray {
    return this.risultatiForm.get('tavoli') as FormArray;
  }

  postiRisultati(indexTavolo: number): FormArray {
    return this.tavoliRisultati.at(indexTavolo).get('posti') as FormArray;
  }

  aggiungiTavoloRisultati() {
    this.tavoliRisultati.push(this.fb.group({
      numeroPostiCorretto: [1, [Validators.required, Validators.min(1)]],
      posti: this.fb.array([])
    }));
  }

  aggiungiPostoRisultati(indexTavolo: number) {
    this.postiRisultati(indexTavolo).push(this.fb.control(null, Validators.required));
  }

  salvaRisultati() {
    if (this.risultatiForm.invalid) {
      alert('Il form dei risultati non è valido. Compila tutti i campi.');
      return;
    }
    this.gameService.saveRisultatiUfficiali(this.risultatiForm.value)
      .then(() => alert('Risultati ufficiali salvati!'))
      .catch(err => alert(`Errore nel salvataggio dei risultati: ${err.message}`));
  }

  calcolaClassifica() {
    alert('Logica di calcolo non ancora implementata!');
  }

  togglePredictionsLock() {
    const currentState = this.gameSettings()?.predictionsLocked ?? false;
    this.gameService.updateGameSettings({ predictionsLocked: !currentState })
      .then(() => {
        alert(`Previsioni ora ${!currentState ? 'BLOCCATE' : 'SBLOCCATE'}.`);
      })
      .catch(err => alert(`Errore: ${err.message}`));
  }
}
