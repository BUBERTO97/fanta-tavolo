import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  collectionData,
  writeBatch,
  updateDoc, onSnapshot, where, getDocs, query
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {GameSettings, Invitato, LeaderboardEntry, Pronostico, RisultatiUfficiali, ScoringRules} from './game.models';

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
      const invitatoDoc = doc(this.firestore, `invitati/${invitato.id}`);
      batch.set(invitatoDoc, invitato, { merge: true });
    });
    return batch.commit();
  }

  updateInvitato(invitato: Invitato): Promise<void> {
    const invitatoDoc = doc(this.firestore, `invitati/${invitato.id}`);
    return setDoc(invitatoDoc, invitato, { merge: true });
  }

  confermaVoto(userId: string, status: boolean): Promise<void> {
    const pronosticoDoc = doc(this.firestore, `pronostici/${userId}`);
    return updateDoc(pronosticoDoc, { confermato: status });
  }

  saveRisultatiUfficiali(risultati: any): Promise<void> {
    const risultatiDoc = doc(this.firestore, 'risultati/ufficiali');
    return setDoc(risultatiDoc, risultati, { merge: true });
  }

  getGameSettings(): Observable<GameSettings> {
    const settingsDoc = doc(this.firestore, 'settings/game');
    return new Observable(subscriber => {
      const unsubscribe = onSnapshot(settingsDoc, (doc) => {
        subscriber.next(doc.data() as GameSettings);
      });
      return () => unsubscribe();
    });
  }

  updateGameSettings(settings: Partial<GameSettings>): Promise<void> {
    const settingsDoc = doc(this.firestore, 'settings/game');
    return setDoc(settingsDoc, settings, { merge: true });
  }

  saveScoringRules(rules: ScoringRules): Promise<void> {
    const rulesDoc = doc(this.firestore, 'settings/scoring');
    return setDoc(rulesDoc, rules);
  }

  async getScoringRules(): Promise<ScoringRules | null> {
    const rulesDoc = doc(this.firestore, 'settings/scoring');
    const snapshot = await getDoc(rulesDoc);
    return snapshot.exists() ? snapshot.data() as ScoringRules : null;
  }

  saveLeaderboard(leaderboard: LeaderboardEntry[]): Promise<void> {
    const batch = writeBatch(this.firestore);
    leaderboard.forEach(entry => {
      const leaderboardDoc = doc(this.firestore, `leaderboard/${entry.userId}`);
      batch.set(leaderboardDoc, entry);
    });
    return batch.commit();
  }

  async getConfirmedPronostici(): Promise<Pronostico[]> {
    const pronosticiCol = collection(this.firestore, 'pronostici');
    const q = query(pronosticiCol, where("confermato", "==", true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => d.data() as Pronostico);
  }

  async getRisultatiUfficiali(): Promise<RisultatiUfficiali | null> {
    const risultatiDoc = doc(this.firestore, 'risultati/ufficiali');
    const snapshot = await getDoc(risultatiDoc);

    return snapshot.exists() ? snapshot.data() as RisultatiUfficiali : null;
  }
}
