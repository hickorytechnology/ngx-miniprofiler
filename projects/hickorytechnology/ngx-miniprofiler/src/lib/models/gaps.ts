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
