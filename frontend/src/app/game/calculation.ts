import { Injectable } from '@angular/core';
import {Pronostico, RisultatiUfficiali, ScoringRules} from './game.models';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  calculateScore(pronostico: Pronostico, risultatiUfficiali: RisultatiUfficiali, rules: ScoringRules) {
    let score = 0;

    pronostico.tavoli.forEach((tavoloPronosticato, indexTavolo) => {
      const tavoloUfficiale = risultatiUfficiali.tavoli[indexTavolo];
      if (!tavoloUfficiale) return;

      tavoloPronosticato.posti.forEach((postoPronosticato, indexPosto) => {
        const postoUfficiale = tavoloUfficiale.posti[indexPosto];
        if (!postoUfficiale) {
          score -= rules.puntiRispostaSbagliata; // Posto inesistente
          return;
        }

        if (postoPronosticato.invitatoId === postoUfficiale.invitatoId) {
          score += rules.puntiRispostaEsatta; // Risposta esatta
        } else {
          score -= rules.puntiRispostaSbagliata; // Risposta sbagliata
        }
      });
    });

    // 2. Calcolo COMBO
    // Combo: Numero tavoli corretto
    if (pronostico.tavoli.length === risultatiUfficiali.tavoli.length) {
      score *= rules.comboNumeroTavoliCorretto;
    }

    pronostico.tavoli.forEach((tavoloPronosticato, indexTavolo) => {
      const tavoloUfficiale = risultatiUfficiali.tavoli[indexTavolo];
      if (!tavoloUfficiale) return;

      // Combo: Numero persone per tavolo corretto
      if (tavoloPronosticato.posti.length === tavoloUfficiale.posti.length) {
        score *= rules.comboNumeroPersonePerTavoloCorretto;
      }

      // Combo: Tutti i posti corretti per un tavolo
      const tuttiPostiCorretti = tavoloPronosticato.posti.every((posto, indexPosto) =>
        posto.invitatoId === tavoloUfficiale.posti[indexPosto]?.invitatoId
      );
      if (tuttiPostiCorretti) {
        score *= rules.comboTuttiIPostiCorretti;
      }
    });

    return score;
  }
}
