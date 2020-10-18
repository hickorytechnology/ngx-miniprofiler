import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IProfiler } from '../models/profiler';
import { ResultRequest } from '../models/result-request';
import { ITimingInfo } from '../models/timing';
import { NgxMiniProfilerOptions } from './ngx-miniprofiler-options';

@Injectable({
  providedIn: 'root',
})
export class NgxMiniprofilerService {
  constructor(private http: HttpClient, private options: NgxMiniProfilerOptions) {}

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
    const headers: HttpHeaders = new HttpHeaders({ Accept: 'application/json' });
    const requests: Observable<IProfiler>[] = [];
    for (const id of ids) {
      const apiCall = `${this.options.api}/results?id=${id}`;
      requests.push(
        this.http
          .get<IProfiler>(apiCall, { headers, responseType: 'json' })
          .pipe(
            map((x) => {
              return {
                ...x,
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
}
