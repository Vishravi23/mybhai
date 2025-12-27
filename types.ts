
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum BotState {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  ERROR = 'ERROR'
}
