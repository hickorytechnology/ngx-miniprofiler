import { IClientTimings, ICustomTiming, ICustomTimingStat, ITiming } from './timing';

export interface IProfiler {
  Id: string;
  Name: string;
  Started: Date;
  DurationMilliseconds: number;
  MachineName: string;
  CustomLinks: { [id: string]: string };
  Root: ITiming;
  ClientTimings: IClientTimings;
  User: string;
  HasUserViewed: boolean;
  // additive on client side
  CustomTimingStats: { [id: string]: ICustomTimingStat };
  HasCustomTimings: boolean;
  HasDuplicateCustomTimings: boolean;
  HasWarning: boolean;
  HasTrivialTimings: boolean;
  AllCustomTimings: ICustomTiming[];
}
