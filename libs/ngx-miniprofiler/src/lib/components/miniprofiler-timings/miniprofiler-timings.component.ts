import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Optional, Output, ViewEncapsulation } from '@angular/core';
import { DialogRef, DialogService } from '@ngneat/dialog';
import { Subscription } from 'rxjs';
import { MiniProfilerDefaultOptions, NGX_MINIPROFILER_DEFAULT_OPTIONS } from '../../default-options';
import { IProfiler, ITiming } from '../../models';
import { MiniProfilerQueryDialogComponent } from '../miniprofiler-query-dialog/miniprofiler-query-dialog.component';

@Component({
  selector: 'ht-miniprofiler-timings',
  templateUrl: './miniprofiler-timings.component.html',
  styleUrls: ['./miniprofiler-timings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MiniProfilerTimingsComponent implements OnInit, OnDestroy {
  @Input()
  result!: IProfiler;

  @Output()
  timingsDialogOpen = new EventEmitter<DialogRef<{
    profilerResult: IProfiler;
    timing: ITiming;
  }, unknown, any>>();

  @Output()
  toggleMoreColumns = new EventEmitter<boolean>();

  @Output()
  toggleTrivialTimings = new EventEmitter<boolean>();

  public customTimingTypes: any[] = [];
  public customTimings: any[] = [];
  public customTimingPropertyNames: string[] = [];
  public customLinks: string[] = [];

  private showMoreColumns = false;
  private showTrivialTimings = false;

  private subscriptions = new Subscription();

  constructor(
    private dialog: DialogService,
    private cdr: ChangeDetectorRef,
    @Optional()
    @Inject(NGX_MINIPROFILER_DEFAULT_OPTIONS)
    private profilerOptions: MiniProfilerDefaultOptions
  ) { }

  public ngOnInit(): void {
    this.customTimingTypes = this.result.CustomTimingStats ? Object.keys(this.result.CustomTimingStats) : [];
    this.customTimings = this.result.CustomTimingStats ? Object.keys(this.result.CustomTimingStats) : [];
    this.customTimingPropertyNames = this.result.CustomTimingStats
      ? Object.getOwnPropertyNames(this.result.CustomTimingStats)
      : [];
    this.customLinks = this.result.CustomLinks ? Object.keys(this.result.CustomLinks) : [];
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public get options(): MiniProfilerDefaultOptions {
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
    const dur = this.duration(this.result.CustomTimingStats[timingName].Duration);
    const count = this.result.CustomTimingStats[timingName].Count;
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

  public openQueryDialog(timing: ITiming, event: Event): void {
    event.preventDefault();
    const dialogRef = this.dialog.open(MiniProfilerQueryDialogComponent, {
      size: 'fullScreen',
      data: {
        profilerResult: this.result,
        timing,
      },
    });
    this.timingsDialogOpen.emit(dialogRef);
  }

  public onClickToggleMoreColumns(): void {
    this.showMoreColumns = !this.showMoreColumns;
    this.toggleMoreColumns.emit(this.showMoreColumns);
  }

  public onClickToggleTrivialTimings(): void {
    this.showTrivialTimings = !this.showTrivialTimings;
    this.toggleTrivialTimings.emit(this.showTrivialTimings);
  }
}
