export interface IUser {
  id: any;
  email: string;
  profile_data: any;
  app_metadata?: any;
  user_metadata?: any;
  created_at?: string;
  updated_at?: string;
  session: ISession;
}

export interface ISession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface AuthResponse {
  user: IUser | null;
  session: ISession;
}

export interface AuthErrorResponse {
  message: string;
  status: number;
  data?: any;
}

export interface UserAttributes {
  email?: string;
  password?: string;
}

export interface ProfileData {
  id?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  email?: string;
  usatt_member_id?: number;
  date_of_birth?: Date;
  role?: string;
}

export interface ITournament {
  id: number;
  owner_id: number;
  name: string;
  location: string;
  venue: string;
  start_date: Date;
  end_date: Date;
  tournament_description: string;
  registration_open: boolean;
  entry_blank_url: string;
  level: string;
}

export interface ILeague {
  id: number;
  owner_id: number;
  name: string;
  location: string;
  venue: string;
  start_date: Date;
  end_date: Date;
  league_description: string;
  registration_open: boolean;
  entry_blank_url: string;
}

export interface ITrainingCamp {
  id: number;
  owner_id: number;
  name: string;
  location: string;
  venue: string;
  start_date: Date;
  end_date: Date;
  camp_description: string;
  registration_open: boolean;
  entry_blank_url: string;
}

export interface ITournamentEvent {
  id: number;
  tournament_id: number;
  name: string;
  price: number;
  format: number;
  max_players: number;
  start_date: Date;
  created_at: string;
}

export interface ILeagueEvent {
  id: number;
  league_id: number;
  club_id: number;
  name: string;
  price: number;
  max_players: number;
  start_date: Date;
  created_at: string;
}

export interface ITrainingCampEvent {
  id: number;
  camp_id: number;
  created_at: string;
  club_id: number;
  name: string;
  price: number;
  max_players: number;
  start_date: Date;
}

export type Activity = ITournament | ILeague | ITrainingCamp;

export type ActivityType = 'tournaments' | 'leagues' | 'camps';

export function getActivityType(activity: Activity): ActivityType | null {
  if ('tournament_description' in activity) {
    return 'tournaments';
  } else if ('league_description' in activity) {
    return 'leagues';
  } else if ('camp_description' in activity) {
    return 'camps';
  } else {
    return null;
  }
}

export type Event = ITournamentEvent | ILeagueEvent | ITrainingCampEvent;

export type EventType = 'tournament_events' | 'league_events' | 'camp_events';

export function getEventType(event: Event): EventType | null {
  if ('tournament_id' in event) {
    return 'tournament_events';
  } else if ('league_id' in event) {
    return 'league_events';
  } else if ('camp_id' in event) {
    return 'camp_events';
  } else {
    return null;
  }
}

export interface EventEnrollment {
  user_id: string;
  event_type: string;
  activity_id: number;
  event_id: number;
}

export interface IClubMembership {
  id: number;
  club_id: number;
  club_name: string;
  price: number;
}

export interface CartItem {
  id: number;
  user_id: string;
  product_category: string;
  product_id: number;
}
export type CartItemDetails =
  | ITournamentEvent
  | ILeagueEvent
  | ITrainingCampEvent;

export type CartItemType =
  | 'tournament_events'
  | 'league_events'
  | 'camp_events'
  | 'apperal_products';

export function getCartItemType(
  cartItem: CartItemDetails
): CartItemType | null {
  if ('tournament_id' in cartItem) {
    return 'tournament_events';
  } else if ('league_id' in cartItem) {
    return 'league_events';
  } else if ('camp_id' in cartItem) {
    return 'camp_events';
  } else if ('apperal_product_id' in cartItem) {
    return 'apperal_products';
  } else {
    return null;
  }
}
