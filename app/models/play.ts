import type { PeriodDescriptor } from './period-descriptor';

export class Play {
  eventId: number;
  periodDescriptor: PeriodDescriptor;
  timeInPeriod: string;
  timeRemaining: string;
  situationCode: string;
  homeTeamDefendingSide: 'left' | 'right';
  typeCode: number;
  typeDescKey: string;
  sortOrder: number;

  constructor(data: Partial<Play>) {
    this.eventId = data.eventId ?? 0;
    this.periodDescriptor = data.periodDescriptor ?? {
      number: 0,
      periodType: '',
      maxRegulationPeriods: 0,
    };
    this.timeInPeriod = data.timeInPeriod ?? '';
    this.timeRemaining = data.timeRemaining ?? '';
    this.situationCode = data.situationCode ?? '';
    this.homeTeamDefendingSide = data.homeTeamDefendingSide ?? 'left';
    this.typeCode = data.typeCode ?? 0;
    this.typeDescKey = data.typeDescKey ?? '';
    this.sortOrder = data.sortOrder ?? 0;
  }
}
