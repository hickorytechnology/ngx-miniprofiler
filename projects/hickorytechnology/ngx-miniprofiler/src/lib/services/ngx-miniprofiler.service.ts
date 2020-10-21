import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Inject, Injectable, Optional } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IGapInfo, IGapReason, IGapTiming } from '../models/gaps';
import { IProfiler } from '../models/profiler';
import { ResultRequest } from '../models/result-request';
import { ICustomTiming, ICustomTimingStat, ITiming, ITimingInfo } from '../models/timing';
import { NgxMiniProfilerDefaultOptions, NGX_MINIPROFILER_DEFAULT_OPTIONS } from '../ngx-miniprofiler-options';

@Injectable({
  providedIn: 'root',
})
export class NgxMiniprofilerService {
  constructor(
    private http: HttpClient,
    @Optional()
    @Inject(NGX_MINIPROFILER_DEFAULT_OPTIONS)
    private options: NgxMiniProfilerDefaultOptions
  ) {}

  public container: HTMLDivElement;
  public controls: HTMLDivElement;
  public fetchStatus: { [id: string]: string } = {}; // so we never pull down a profiler twice
  public idUpdated = new EventEmitter<string[]>();

  private miniProfilerIds: string[] = [];
  private savedJson: IProfiler[] = [];
  private clientPerfTimings: ITimingInfo[] = [
    // { name: 'navigationStart', description: 'Navigation Start' },
    // { name: 'unloadEventStart', description: 'Unload Start' },
    // { name: 'unloadEventEnd', description: 'Unload End' },
    // { name: 'redirectStart', description: 'Redirect Start' },
    // { name: 'redirectEnd', description: 'Redirect End' },
    { name: 'fetchStart', description: 'Fetch Start', lineDescription: 'Fetch', point: true } as ITimingInfo,
    {
      name: 'domainLookupStart',
      description: 'Domain Lookup Start',
      lineDescription: 'DNS Lookup',
      type: 'dns',
    } as ITimingInfo,
    { name: 'domainLookupEnd', description: 'Domain Lookup End', type: 'dns' } as ITimingInfo,
    {
      name: 'connectStart',
      description: 'Connect Start',
      lineDescription: 'Connect',
      type: 'connect',
    } as ITimingInfo,
    {
      name: 'secureConnectionStart',
      description: 'Secure Connection Start',
      lineDescription: 'SSL/TLS Connect',
      type: 'ssl',
    } as ITimingInfo,
    { name: 'connectEnd', description: 'Connect End', type: 'connect' } as ITimingInfo,
    {
      name: 'requestStart',
      description: 'Request Start',
      lineDescription: 'Request',
      type: 'request',
    } as ITimingInfo,
    {
      name: 'responseStart',
      description: 'Response Start',
      lineDescription: 'Response',
      type: 'response',
    } as ITimingInfo,
    { name: 'responseEnd', description: 'Response End', type: 'response' } as ITimingInfo,
    { name: 'domLoading', description: 'DOM Loading', lineDescription: 'DOM Loading', type: 'dom' } as ITimingInfo,
    {
      name: 'domInteractive',
      description: 'DOM Interactive',
      lineDescription: 'DOM Interactive',
      type: 'dom',
      point: true,
    } as ITimingInfo,
    {
      name: 'domContentLoadedEventStart',
      description: 'DOM Content Loaded Event Start',
      lineDescription: 'DOM Content Loaded',
      type: 'domcontent',
    } as ITimingInfo,
    {
      name: 'domContentLoadedEventEnd',
      description: 'DOM Content Loaded Event End',
      type: 'domcontent',
    } as ITimingInfo,
    {
      name: 'domComplete',
      description: 'DOM Complete',
      lineDescription: 'DOM Complete',
      type: 'dom',
      point: true,
    } as ITimingInfo,
    {
      name: 'loadEventStart',
      description: 'Load Event Start',
      lineDescription: 'Load Event',
      type: 'load',
    } as ITimingInfo,
    { name: 'loadEventEnd', description: 'Load Event End', type: 'load' } as ITimingInfo,
    {
      name: 'firstPaintTime',
      description: 'First Paint',
      lineDescription: 'First Paint',
      type: 'paint',
      point: true,
    } as ITimingInfo,
    {
      name: 'firstContentfulPaintTime',
      description: 'First Content Paint',
      lineDescription: 'First Content Paint',
      type: 'paint',
      point: true,
    } as ITimingInfo,
  ];

  public highlight = (elem: HTMLElement): void => undefined;

  /**
   * asd
   * @param ids MiniProfiler IDs that are
   */
  public setIds(ids: string[]): void {
    if (this.miniProfilerIds !== ids) {
      this.miniProfilerIds = ids;
      this.idUpdated.emit(this.miniProfilerIds);
    }
  }

  /**
   * asd
   * @param ids MiniProfiler IDs that are used to fetch results
   */
  public fetchResults(ids: string[]): Observable<IProfiler[]> {
    const headers: HttpHeaders = new HttpHeaders({ Accept: 'application/json', skip: 'true' });
    const requests: Observable<IProfiler>[] = [];
    for (const id of ids) {
      const apiCall = `${this.options.api}/results?id=${id}`;
      requests.push(
        this.http
          .get<IProfiler>(apiCall, { headers, responseType: 'json' })
          .pipe(
            map((x) => {
              const processed = this.processProfileResult(x);
              return {
                ...processed,
                Started: this.parseDate(x.Started),
              };
            })
          )
      );
    }

    return forkJoin(requests);
  }

  private parseDate(value: Date): Date {
    const isoDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(?:Z|(\+|-)([\d|:]*))?$/;
    if (typeof value === 'string' && isoDate.exec(value)) {
      return new Date(value);
    }

    return value;
  }

  private processProfileResult(profiler: IProfiler): IProfiler {
    const result: IProfiler = {
      ...profiler,
      CustomTimingStats: {},
      CustomLinks: profiler.CustomLinks || {},
      AllCustomTimings: [],
    };
    const pt = this.processTiming(result.Root, null, 0);
    const processedTiming = pt.timing;

    result.Root = processedTiming;

    const processedCustomTimings = this.processCustomTimings(result);
    result.AllCustomTimings = processedCustomTimings;

    result.HasTrivialTimings = result.Root.IsTrivial;
    result.HasCustomTimings = result.Root.HasCustomTimings;
    result.CustomTimingStats = pt.customTimingStats;

    return result;
  }

  private processTiming(
    timing: ITiming,
    parent: ITiming,
    depth: number
  ): { timing: ITiming; customTimingStats: Record<string, ICustomTimingStat> } {
    const processed: ITiming = {
      ...timing,
      DurationWithoutChildrenMilliseconds: timing.DurationMilliseconds,
      DurationOfChildrenMilliseconds: 0,
      Parent: parent,
      Depth: depth,
      HasDuplicateCustomTimings: {},
      HasWarnings: {},
    };

    const customTimingStats: Record<string, ICustomTimingStat> = {};

    for (const child of processed.Children || []) {
      const pt = this.processTiming(child, processed, depth + 1);
      const childTiming = pt.timing;
      processed.DurationWithoutChildrenMilliseconds -= childTiming.DurationMilliseconds;
      processed.DurationOfChildrenMilliseconds += child.DurationMilliseconds;
    }

    // do this after sutracting child durations
    if (processed.DurationWithoutChildrenMilliseconds < this.options.trivialMilliseconds) {
      processed.IsTrivial = true;
      // result.HasTrivialTimings = true;
    }

    if (timing.CustomTimings) {
      processed.CustomTimingStats = {};
      processed.HasCustomTimings = true;
      // result.HasCustomTimings = true;

      for (const customType of Object.keys(timing.CustomTimings)) {
        const customTimings = timing.CustomTimings[customType] || ([] as ICustomTiming[]);
        const customStat = {
          Duration: 0,
          Count: 0,
        };
        const duplicates: { [id: string]: boolean } = {};

        for (const customTiming of customTimings) {
          // add to the overall list for the queries view
          // result.AllCustomTimings.push(customTiming);
          customTiming.Parent = timing;
          customTiming.CallType = customType;

          customStat.Duration += customTiming.DurationMilliseconds;

          // whether or not duplicate custom timing should be ignored
          const ignored =
            customTiming.ExecuteType &&
            this.options.ignoredDuplicateExecuteTypes.indexOf(customTiming.ExecuteType) > -1;
          if (!ignored) {
            customStat.Count++;
          }

          if (customTiming.Errored) {
            processed.HasWarnings[customType] = true;
            // result.HasWarning = true;
          }

          if (customTiming.CommandString && duplicates[customTiming.CommandString]) {
            customTiming.IsDuplicate = true;
            processed.HasDuplicateCustomTimings[customType] = true;
            // result.HasDuplicateCustomTImings = true;
          } else if (!ignored) {
            duplicates[customTiming.CommandString] = true;
          }
        }

        processed.CustomTimingStats[customType] = customStat;

        if (!customTimingStats[customType]) {
          customTimingStats[customType] = {
            Duration: 0,
            Count: 0,
          };
        }
        customTimingStats[customType].Duration += customStat.Duration;
        customTimingStats[customType].Count += customStat.Count;
      }
    } else {
      processed.CustomTimings = {};
    }

    return {
      timing: processed,
      customTimingStats,
    };
  }

  private processCustomTimings(profiler: IProfiler): ICustomTiming[] {
    const newProfiler: IProfiler = { ...profiler };
    const processedTiming = this.processCustomTimes(newProfiler.Root);
    newProfiler.Root = processedTiming;

    // sort processed timing results by time
    const result = newProfiler.AllCustomTimings;
    result.sort((a, b) => a.StartMilliseconds - b.StartMilliseconds);

    let time = 0;
    result.forEach((elem) => {
      elem.PrevGap = {
        duration: (elem.StartMilliseconds - time).toFixed(2),
        start: time,
        finish: elem.StartMilliseconds,
      } as IGapInfo;

      elem.PrevGap.Reason = this.determineGap(elem.PrevGap, profiler.Root, null);

      time = elem.StartMilliseconds + elem.DurationMilliseconds;
    });

    if (result.length > 0) {
      const me = result[result.length - 1];
      me.NextGap = {
        duration: (profiler.Root.DurationMilliseconds - time).toFixed(2),
        start: time,
        finish: profiler.Root.DurationMilliseconds,
      } as IGapInfo;
      me.NextGap.Reason = this.determineGap(me.NextGap, profiler.Root, null);
    }

    return result;
  }

  private processCustomTimes(timing: ITiming): ITiming {
    const processed: ITiming = { ...timing };
    const duration: IGapTiming = {
      start: timing.StartMilliseconds,
      finish: timing.StartMilliseconds + timing.DurationMilliseconds,
    } as IGapTiming;

    processed.richTiming = [duration];
    if (processed.Parent != null) {
      processed.Parent.richTiming = this.removeDuration(processed.Parent.richTiming, duration);
    }

    const processedChildTimings: ITiming[] = [];
    for (const child of timing.Children || []) {
      const processedChildTiming = this.processCustomTimes(child);
      processedChildTimings.push(processedChildTiming);
    }

    processed.Children = processedChildTimings;

    return processed;
  }

  private removeDuration(list: IGapTiming[], duration: IGapTiming): IGapTiming[] {
    const newList: IGapTiming[] = [];
    for (const item of list) {
      if (duration.start > item.start) {
        if (duration.start > item.finish) {
          newList.push(item);
          continue;
        }
        newList.push({ start: item.start, finish: duration.start } as IGapTiming);
      }

      if (duration.finish < item.finish) {
        if (duration.finish < item.start) {
          newList.push(item);
          continue;
        }
        newList.push({ start: duration.finish, finish: item.finish } as IGapTiming);
      }
    }

    return newList;
  }

  private determineGap(gap: IGapInfo, node: ITiming, match: IGapReason): IGapReason {
    const overlap = this.determineOverlap(gap, node);
    if (match == null || overlap > match.duration) {
      match = { name: node.Name, duration: overlap };
    } else if (match.name === node.Name) {
      match.duration += overlap;
    }

    for (const child of node.Children || []) {
      match = this.determineGap(gap, child, match);
    }

    return match;
  }

  private determineOverlap(gap: IGapInfo, node: ITiming): number {
    let overlap = 0;
    for (const current of node.richTiming) {
      if (current.start > gap.finish) {
        break;
      }
      if (current.finish < gap.start) {
        continue;
      }

      overlap += Math.min(gap.finish, current.finish) - Math.max(gap.start, current.start);
    }

    return overlap;
  }
}
