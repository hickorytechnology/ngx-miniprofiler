import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  Observable,
  ReplaySubject,
  Subscription,
  distinctUntilChanged,
  of,
  takeUntil,
} from 'rxjs';
import { PolymorpheusComponent } from '../../cdk/polymorpheus';
import { MiniProfilerDefaultOptions } from '../../default-options';
import { MiniProfilerDialogData } from '../../interfaces/mp-dialog';
import { IProfiler, ITiming } from '../../models';
import { GLOBAL_MINIPROFILER_CONFIG } from '../../providers';
import { MiniProfilerDialogService } from '../../services/dialog.service';
import { filterOnlyPresent } from '../../util/rxjs-operators';
import { MiniProfilerQueryDialogComponent } from '../miniprofiler-query-dialog/miniprofiler-query-dialog.component';

@Component({
  selector: 'ht-miniprofiler-timings',
  templateUrl: './miniprofiler-timings.component.html',
  styleUrls: ['./miniprofiler-timings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MiniProfilerTimingsComponent implements OnInit, OnDestroy {
  private openDialog$: Observable<MiniProfilerDialogData> = of();

  @Input()
  result!: IProfiler;

  // @Output()
  // timingsDialogOpen = new EventEmitter<Observable<MiniProfilerDialogData>>();

  @Output()
  timingsDialogOpen = this.openDialog$.pipe(
    filterOnlyPresent(),
    distinctUntilChanged()
  );

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

  private readonly destroy$ = new ReplaySubject<void>();

  private subscriptions = new Subscription();

  constructor(
    @Inject(GLOBAL_MINIPROFILER_CONFIG)
    private profilerOptions: MiniProfilerDefaultOptions,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(MiniProfilerDialogService)
    private readonly dialogs: MiniProfilerDialogService
  ) {}

  public ngOnInit(): void {
    this.customTimingTypes = this.result.CustomTimingStats
      ? Object.keys(this.result.CustomTimingStats)
      : [];
    this.customTimings = this.result.CustomTimingStats
      ? Object.keys(this.result.CustomTimingStats)
      : [];
    this.customTimingPropertyNames = this.result.CustomTimingStats
      ? Object.getOwnPropertyNames(this.result.CustomTimingStats)
      : [];
    this.customLinks = this.result.CustomLinks
      ? Object.keys(this.result.CustomLinks)
      : [];
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
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

    if (timing.HasWarnings && timing.HasWarnings[timingName]) {
      classNameBuilder.push('mp-queries-warning');
    }

    return classNameBuilder.join(' ');
  }

  public queriesTitle(timing: ITiming, timingName: string): string {
    const dur = this.duration(
      this.result.CustomTimingStats
        ? this.result.CustomTimingStats[timingName].Duration
        : 0
    );
    const count = this.result.CustomTimingStats
      ? this.result.CustomTimingStats[timingName].Count
      : 0;
    const suffix =
      timing.HasDuplicateCustomTimings &&
      timing.HasDuplicateCustomTimings[timingName]
        ? '; duplicate calls detected!'
        : '';
    return `${dur} ms in ${count} ${this.encode(timingName)} call(s)${suffix}`;
  }

  public customTimingTitle(key: string): string {
    const count = this.result.CustomTimingStats
      ? this.result.CustomTimingStats[key].Count
      : 0;
    const dur = this.result.CustomTimingStats
      ? this.result.CustomTimingStats[key].Duration
      : 0;
    return `${count} ${this.encode(
      key.toLowerCase()
    )} calls spent ${this.duration(dur)} ms of total request time`;
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
  public duration(
    milliseconds: number | undefined,
    decimalPlaces?: number
  ): string {
    if (milliseconds === undefined) {
      return '';
    }
    return (milliseconds || 0).toFixed(
      decimalPlaces === undefined ? 1 : decimalPlaces
    );
  }

  public ensureTrailingSlash(url: string) {
    return url.endsWith('/') ? url : `${url}/`;
  }

  public openQueryDialog(timing: ITiming, event: Event): void {
    event.preventDefault();

    this.openDialog$ = this.dialogs
      .open<MiniProfilerDialogData>(
        new PolymorpheusComponent(
          MiniProfilerQueryDialogComponent,
          this.injector
        ),
        {
          size: 'xxl',
          data: {
            profilerResult: this.result,
            timing,
          },
        }
      )
      .pipe(takeUntil(this.destroy$));
    this.openDialog$.subscribe();
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
