import { Injectable, inject } from '@angular/core';
import {Firestore, collection, doc, setDoc, getDoc, collectionData, writeBatch} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Invitato, Pronostico } from './game.models';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly firestore: Firestore = inject(Firestore);

  getInvitati(): Observable<Invitato[]> {
    const invitatiCol = collection(this.firestore, 'invitati');
    return collectionData(invitatiCol, { idField: 'id' }) as Observable<Invitato[]>;
  }

  savePronostico(userId: string, pronostico: Pronostico) {
    const pronosticoDoc = doc(this.firestore, `pronostici/${userId}`);
    return setDoc(pronosticoDoc, pronostico);
  }

  async getPronostico(userId: string): Promise<Pronostico | null> {
    const pronosticoDoc = doc(this.firestore, `pronostici/${userId}`);
    const snapshot = await getDoc(pronosticoDoc);
    return snapshot.exists() ? snapshot.data() as Pronostico : null;
  }

  getVoters(): Observable<Pronostico[]> {
    const pronosticiCol = collection(this.firestore, 'pronostici');
    return collectionData(pronosticiCol) as Observable<Pronostico[]>;
  }

  uploadInvitati(invitati: Invitato[]): Promise<void> {
    const batch = writeBatch(this.firestore);
    invitati.forEach(invitato => {
      // Usiamo l'ID fornito dal CSV come ID del documento
      const invitatoDoc = doc(this.firestore, `invitati/${invitato.id}`);
      // L'opzione { merge: true } aggiorna i campi senza cancellare dati non presenti nel nuovo oggetto
      batch.set(invitatoDoc, invitato, { merge: true });
    });
    return batch.commit();
  }

  // NUOVA FUNZIONE: Aggiorna un singolo invitato
  updateInvitato(invitato: Invitato): Promise<void> {
    const invitatoDoc = doc(this.firestore, `invitati/${invitato.id}`);
    return setDoc(invitatoDoc, invitato, { merge: true });
  }
}
