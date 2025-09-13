import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../game/game.service';
import * as Papa from 'papaparse';
import { Invitato } from '../game/game.models';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent {
  private readonly gameService = inject(GameService);
  private readonly fb = inject(FormBuilder);

  // Dati caricati dal file, in attesa di conferma
  parsedInvitati: Invitato[] = [];
  fileName: string | null = null;

  // Tabella modificabile
  invitatiForm: FormGroup;

  // Segnale per visualizzare la lista attuale in tempo reale
  invitatiInDb = toSignal(this.gameService.getInvitati(), { initialValue: [] });

  constructor() {
    this.invitatiForm = this.fb.group({
      rows: this.fb.array([])
    });
  }

  ngOnInit() {
    // Quando la lista degli invitati nel DB cambia, aggiorna la nostra tabella
    this.gameService.getInvitati().subscribe(invitati => {
      this.populateForm(invitati);
    });
  }

  // Popola la tabella con i dati dal database
  populateForm(invitati: Invitato[]) {
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

  // Gestisce la selezione del file
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

  // Logica per il pulsante "Conferma e Salva in Firebase"
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
        // La tabella si aggiornerà automaticamente grazie alla sottoscrizione in ngOnInit
      })
      .catch(err => alert(`Errore durante il caricamento: ${err.message}`));
  }

  // Converte i dati del CSV nel nostro modello
  private processCsvData(data: any[]): Invitato[] {
    return data.map(row => ({
      id: row.id,
      nome: row.name,
      cognome: row.lastName,
      company: row.company,
      plus1: row.plus1 === '[NULL]' ? '' : row.plus1 // Gestisce il caso '[NULL]'
    }));
  }

  // Logica per il pulsante "Salva Modifiche" della tabella
  saveTableChanges() {
    if (this.invitatiForm.invalid) {
      alert('Controlla i dati, alcuni campi non sono validi.');
      return;
    }
    const promises = this.invitatiRows.controls
      .filter(control => control.dirty) // Salva solo le righe modificate
      .map(control => {
        const invitato: Invitato = control.value;
        return this.gameService.updateInvitato(invitato);
      });

    Promise.all(promises)
      .then(() => {
        alert('Modifiche salvate con successo!');
        this.invitatiForm.markAsPristine(); // Resetta lo stato "dirty" del form
      })
      .catch(err => alert(`Errore nel salvataggio: ${err.message}`));
  }

  // Funzione placeholder per confermare i voti
  confermaVoti() {
    if (confirm('Sei sicuro di voler confermare tutti i voti? Questa azione è irreversibile.')) {
      console.log('Voti confermati (logica da implementare)');
    }
  }

  // Funzione placeholder per calcolare la classifica
  calcolaClassifica() {
    console.log('Calcolo classifica finale (logica da implementare)');
    alert('Classifica calcolata! (Controlla la console)');
  }
}
