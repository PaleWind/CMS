import { ActivityType, EventType } from './types';

export const activityTypes = ['tournaments', 'leagues', 'camps'];

export const activityTypeLabelMap = {
  tournaments: 'Tournament',
  leagues: 'League',
  camps: 'Camp',
};

export const eventTableNames: Record<ActivityType, EventType> = {
  tournaments: 'tournament_events',
  leagues: 'league_events',
  camps: 'camp_events',
};

export const eventParentIdFields: Record<EventType, string> = {
  tournament_events: 'tournament_id',
  league_events: 'league_id',
  camp_events: 'camp_id',
};

export const activityTypesByEventType: Record<EventType, ActivityType> = {
  tournament_events: 'tournaments',
  league_events: 'leagues',
  camp_events: 'camps',
};
