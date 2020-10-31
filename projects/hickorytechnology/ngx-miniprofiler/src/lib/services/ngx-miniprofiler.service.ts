import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Inject, Injectable, Optional } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IGapInfo, IGapReason, IGapTiming } from '../models/gaps';
import { IProfiler } from '../models/profiler';
import { ICustomTiming, ITiming, ITimingInfo } from '../models/timing';
import { NgxMiniProfilerDefaultOptions, NGX_MINIPROFILER_DEFAULT_OPTIONS } from '../ngx-miniprofiler-options';

@Injectable({
  providedIn: 'root',
})
export class NgxMiniProfilerService {
  constructor(
    private http: HttpClient,
    private router: Router,
    @Optional()
    @Inject(NGX_MINIPROFILER_DEFAULT_OPTIONS)
    private options: NgxMiniProfilerDefaultOptions
  ) {
    this.setupRouterEventsListener();
  }

  public container: HTMLDivElement;
  public controls: HTMLDivElement;
  public fetchStatus: { [id: string]: string } = {}; // so we never pull down a profiler twice
  public idUpdated = new EventEmitter<string[]>();

  public flushEvents$ = new BehaviorSubject<boolean>(false);

  private selectedDataSource = new BehaviorSubject<string>(null);
  selectedProfilerResult = this.selectedDataSource.asObservable();

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
   * Updates the selected profiler record.
   * @param id the selected profiler ID
   */
  public selectProfileResult(id: string): void {
    this.selectedDataSource.next(id);
  }

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
    this.processTiming(result, result.Root, null, 0);
    this.processCustomTimings(result);

    // const processedCustomTimings = this.processCustomTimings(result);
    // result.AllCustomTimings = processedCustomTimings;

    // result.HasTrivialTimings = result.Root.IsTrivial;
    // result.HasCustomTimings = result.Root.HasCustomTimings;
    // result.CustomTimingStats = pt.customTimingStats;

    return result;
  }

  private processTiming(profiler: IProfiler, timing: ITiming, parent: ITiming, depth: number): IProfiler {
    timing.DurationWithoutChildrenMilliseconds = timing.DurationMilliseconds;
    timing.DurationOfChildrenMilliseconds = 0;
    timing.Parent = parent;
    timing.Depth = depth;
    timing.HasDuplicateCustomTimings = {};
    timing.HasWarnings = {};

    for (const child of timing.Children || []) {
      this.processTiming(profiler, child, timing, depth + 1);
      timing.DurationWithoutChildrenMilliseconds -= child.DurationMilliseconds;
      timing.DurationOfChildrenMilliseconds += child.DurationMilliseconds;
    }

    // do this after sutracting child durations
    if (timing.DurationWithoutChildrenMilliseconds < this.options.trivialMilliseconds) {
      timing.IsTrivial = true;
      profiler.HasTrivialTimings = true;
    }

    if (timing.CustomTimings) {
      timing.CustomTimingStats = {};
      timing.HasCustomTimings = true;
      profiler.HasCustomTimings = true;

      for (const customType of Object.keys(timing.CustomTimings)) {
        const customTimings = timing.CustomTimings[customType] || ([] as ICustomTiming[]);
        const customStat = {
          Duration: 0,
          Count: 0,
        };
        const duplicates: { [id: string]: boolean } = {};

        for (const customTiming of customTimings) {
          // add to the overall list for the queries view
          profiler.AllCustomTimings.push(customTiming);
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
            timing.HasWarnings[customType] = true;
            profiler.HasWarning = true;
          }

          if (customTiming.CommandString && duplicates[customTiming.CommandString]) {
            customTiming.IsDuplicate = true;
            timing.HasDuplicateCustomTimings[customType] = true;
            profiler.HasDuplicateCustomTimings = true;
          } else if (!ignored) {
            duplicates[customTiming.CommandString] = true;
          }
        }

        timing.CustomTimingStats[customType] = customStat;
        if (!profiler.CustomTimingStats[customType]) {
          profiler.CustomTimingStats[customType] = {
            Duration: 0,
            Count: 0,
          };
        }
        profiler.CustomTimingStats[customType].Duration += customStat.Duration;
        profiler.CustomTimingStats[customType].Count += customStat.Count;
      }
    } else {
      timing.CustomTimings = {};
    }

    return profiler;
  }

  private processCustomTimings(profiler: IProfiler): ICustomTiming[] {
    const result = profiler.AllCustomTimings;
    result.sort((a, b) => a.StartMilliseconds - b.StartMilliseconds);

    this.processCustomTimes(profiler.Root);
    // sort results by time
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

  private processCustomTimes(elem: ITiming): void {
    const duration = {
      start: elem.StartMilliseconds,
      finish: elem.StartMilliseconds + elem.DurationMilliseconds,
    } as IGapTiming;

    elem.richTiming = [duration];
    if (elem.Parent != null) {
      elem.Parent.richTiming = this.removeDuration(elem.Parent.richTiming, duration);
    }

    for (const child of elem.Children || []) {
      this.processCustomTimes(child);
    }
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

  /**
   * Subscribe to Angular's router events to determine if the
   * current profiler results should be flushed.
   */
  private setupRouterEventsListener(): void {
    if (this.options.flushResultsOnRouteNavigate) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.flushEvents$.next(true);
        }
      });
    }
  }
}
