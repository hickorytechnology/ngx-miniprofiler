import { IGapInfo, IGapTiming } from './gaps';

export interface ITiming {
  Id: string;
  Name: string;
  DurationMilliseconds: number;
  StartMilliseconds: number;
  Children: ITiming[];
  CustomTimings: Record<string, ICustomTiming[]>;
  // additive on client side
  CustomTimingStats: Record<string, ICustomTimingStat>;
  DurationWithoutChildrenMilliseconds: number;
  DurationOfChildrenMilliseconds: number;
  Depth: number;
  HasCustomTimings: boolean;
  HasDuplicateCustomTimings: Record<string, boolean>;
  HasWarnings: Record<string, boolean>;
  IsTrivial: boolean;
  Parent: ITiming;
  // added for gaps (TODO: change all this)
  richTiming: IGapTiming[];
  // In debug mode only
  DebugInfo: ITimingDebugInfo;
}

export interface ITimingDebugInfo {
  RichHtmlStack: string;
}

export interface ICustomTiming {
  Id: string;
  CommandString: string;
  ExecuteType: string;
  StackTraceSnippet: string;
  StartMilliseconds: number;
  DurationMilliseconds: number;
  FirstFetchDurationMilliseconds?: number;
  Errored: boolean;
  // client side:
  Parent: ITiming;
  CallType: string;
  IsDuplicate: boolean;
  // added for gaps
  PrevGap: IGapInfo;
  NextGap: IGapInfo;
}

export interface ICustomTimingStat {
  Count: number;
  Duration: number;
}

export interface ITimingInfo {
  name: string;
  description: string;
  lineDescription: string;
  type: string;
  point: boolean;
}

export interface IClientTimings {
  Timings: ClientTiming[];
  RedirectCount: number;
}

export class ClientTiming {
  public Name: string;
  public Start: number;
  public Duration: number;
  constructor(name: string, start: number, duration?: number) {
    this.Name = name;
    this.Start = start;
    this.Duration = duration;
  }
}
