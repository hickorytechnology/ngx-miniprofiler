import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IProfiler } from '../../models/profiler';
import { ITiming } from '../../models/timing';
import { NgxMiniProfilerOptions } from '../../services/ngx-miniprofiler-options';
import { NgxMiniprofilerService } from '../../services/ngx-miniprofiler.service';

@Component({
  selector: 'ngx-miniprofiler-timings',
  templateUrl: './ngx-miniprofiler-timings.component.html',
  styleUrls: ['./ngx-miniprofiler-timings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NgxMiniProfilerTimingsComponent implements OnInit, OnDestroy {
  @Input()
  result: IProfiler;

  public customTimingTypes: any[] = [];
  public customTimings: any[] = [];
  public customTimingPropertyNames: string[] = [];
  public customLinks: string[] = [];

  private subscriptions = new Subscription();

  constructor(
    private profilerService: NgxMiniprofilerService,
    private profilerOptions: NgxMiniProfilerOptions,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.customTimingTypes = this.result.CustomTimingStats ? Object.keys(this.result.CustomTimingStats) : [];
    this.customTimings = this.result.CustomTimingStats ? Object.keys(this.result.CustomTimingStats) : []; )
    this.customTimingPropertyNames = Object.getOwnPropertyNames(this.result.CustomTimingStats);
    this.customLinks = Object.keys(this.result.CustomLinks);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get options(): NgxMiniProfilerOptions {
    return this.profilerOptions;
  }

  public timingClassName(timing: ITiming): string {
    const classNameBuilder: string[] = [];

    if (timing.IsTrivial) {
      classNameBuilder.push('mp-trivial');
    }

    if (timing.DebugInfo) {
      classNameBuilder.push('mp-debug');
    }

    return classNameBuilder.join(' ');
  }

  public queriesClassName(timing: ITiming, timingName: string): string {
    const classNameBuilder: string[] = ['mp-queries-show'];

    if (timing.HasWarnings[timingName]) {
      classNameBuilder.push('mp-queries-warning');
    }

    return classNameBuilder.join(' ');
  }

  public queriesTitle(timing: ITiming, timingName: string): string {
    const dur = this.duration(timing.CustomTimingStats[timingName].Duration);
    const count = timing.CustomTimingStats[timingName].Count;
    const suffix = timing.HasDuplicateCustomTimings[timingName] ? '; duplicate calls detected!' : '';
    return `${dur} ms in ${count} ${this.encode(timingName)} call(s)${suffix}`;
  }

  public customTimingTitle(key: string): string {
    const count = this.result.CustomTimingStats[key].Count;
    const dur = this.result.CustomTimingStats[key].Duration;
    return `${count} ${this.encode(key.toLowerCase())} calls spent ${this.duration(dur)} ms of total request time`;
  }

  /**
   * HTML sanitizes the provided argument.
   * @param orig the unencoded original value
   */
  public encode(orig: string): string {
    return (orig || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   *
   * @param milliseconds
   * @param decimalPlaces
   */
  public duration(milliseconds: number | undefined, decimalPlaces?: number): string {
    if (milliseconds === undefined) {
      return '';
    }
    return (milliseconds || 0).toFixed(decimalPlaces === undefined ? 1 : decimalPlaces);
  }
}
