export interface Invitato {
  id: string; // Questo sarà l'UUID dal file
  nome: string;
  cognome: string;
  company?: string; // Campo opzionale
  plus1?: string;   // Campo opzionale
}

export interface Posto {
  invitatoId: string | null;
}

export interface Tavolo {
  forma: 'tondo' | 'rettangolare' | 'ferro di cavallo';
  posti: Posto[];
}

export interface Pronostico {
  userId: string;
  userEmail: string;
  tavoli: Tavolo[];
  confermato?: boolean;
}

export interface GameSettings {
  predictionsLocked: boolean;
}
