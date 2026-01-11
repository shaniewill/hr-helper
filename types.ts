export interface Participant {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  members: Participant[];
}

export enum AppMode {
  INPUT = 'input',
  LOTTERY = 'lottery',
  GROUPING = 'grouping'
}

export interface Winner {
  participant: Participant;
  timestamp: Date;
}