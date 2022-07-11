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
    this.Duration = duration ?? 0;
  }
}

export enum ColorScheme {
  Light = 'Light',
  Dark = 'Dark',
  Auto = 'Auto',
}

export interface ITiming {
  Id: string;
  Name: string;
  DurationMilliseconds: number;
  StartMilliseconds: number;
  Children: ITiming[];
  CustomTimings: { [id: string]: ICustomTiming[] };
  // additive on client side
  CustomTimingStats: { [id: string]: ICustomTimingStat };
  DurationWithoutChildrenMilliseconds: number;
  DurationOfChildrenMilliseconds: number;
  Depth: number;
  HasCustomTimings: boolean;
  HasDuplicateCustomTimings: { [id: string]: boolean };
  HasWarnings: { [id: string]: boolean };
  IsTrivial: boolean;
  Parent: ITiming | undefined;
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

export interface IOptions {
  authorized: boolean;
  colorScheme: ColorScheme;
  currentId: string;
  ids: string[];
  ignoredDuplicateExecuteTypes: string[];
  maxTracesToShow: number;
  path: string;
  renderPosition: RenderPosition;
  showChildrenTime: boolean;
  showControls: boolean;
  showTrivial: boolean;
  startHidden: boolean;
  toggleShortcut: string;
  trivialMilliseconds: number;
  version: string;
}

export enum RenderMode {
  Corner,
  Full,
}

export enum RenderPosition {
  Left = 'Left',
  Right = 'Right',
  BottomLeft = 'BottomLeft',
  BottomRight = 'BottomRight',
}

// Gaps
export interface IGapTiming {
  start: number;
  finish: number;
  duration: number;
}

export interface IGapInfo {
  start: number;
  finish: number;
  duration: string;
  Reason: IGapReason;
}

export interface IGapReason {
  name: string;
  duration: number;
}
