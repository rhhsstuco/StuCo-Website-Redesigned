import {createContext} from 'react';
import {
  Event,
  Member,
  Recent,
  UpcomingMiniEvents,
  Club,
  FAQ,
  Photo,
  CountDown
} from './interfaces';

export interface IInfoContext {
  events: Event[];
  countdown: CountDown[];
  members: Member[];
  recents: Recent[];
  upcomingMiniEvents: UpcomingMiniEvents[];
  clubs: Club[];
  faq: FAQ[];
  gallery: Photo[];
}

export const InfoContext = createContext<IInfoContext>({
  events: [],
  countdown: [],
  members: [],
  recents: [],
  upcomingMiniEvents: [],
  clubs: [],
  faq: [],
  gallery: [],
});
