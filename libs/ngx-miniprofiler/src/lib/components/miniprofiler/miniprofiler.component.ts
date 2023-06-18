import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, Subscription, of, switchMap } from 'rxjs';
import { MiniProfilerDefaultOptions } from '../../default-options';
import { IProfiler } from '../../models';
import { GLOBAL_MINIPROFILER_CONFIG } from '../../providers';
import { MiniProfilerService } from '../../services/miniprofiler.service';

@Component({
  selector: 'ht-miniprofiler',
  templateUrl: './miniprofiler.component.html',
  styleUrls: ['./miniprofiler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MiniProfilerComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(ChangeDetectorRef) private readonly cdr: ChangeDetectorRef,
    @Inject(GLOBAL_MINIPROFILER_CONFIG)
    private profilerOptions: MiniProfilerDefaultOptions,
    private profilerService: MiniProfilerService
  ) {}

  public results$: Observable<IProfiler[]> = of();
  public profileResults: IProfiler[] = [];

  private readonly subscriptions = new Subscription();

  public ngOnInit(): void {
    const findResultsFromIds$ = (allIds: string[]) => {
      // remove any ids that we already have profile results for
      const currentIds = new Set(this.profileResults.map((x) => x.Id));
      const ids = allIds.filter((id) => !currentIds.has(id));

      return this.profilerService.fetchResults(ids).pipe(
        switchMap((results) => {
          let formatted = this.profileResults;
          formatted = formatted
            .concat(results)
            .sort(
              (x, y) =>
                new Date(x.Started).getTime() - new Date(y.Started).getTime()
            );

          if (this.options.maxTracesToShow > 0) {
            formatted = formatted.slice(
              Math.max(formatted.length - this.options.maxTracesToShow, 0)
            );
          }

          this.profileResults = formatted;
          this.cdr.markForCheck();
          return of(formatted);
        })
      );
    };

    this.subscriptions.add(
      this.profilerService.idUpdated
        .pipe(switchMap((ids) => findResultsFromIds$(ids)))
        .subscribe()
    );

    if (this.options.flushResultsOnRouteNavigate) {
      this.subscriptions.add(
        this.profilerService.flushEvents$.subscribe(() => {
          this.profileResults = [];
          this.cdr.markForCheck();
        })
      );
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public get options(): MiniProfilerDefaultOptions {
    return this.profilerOptions;
  }

  public get controlsClassName(): string {
    const classNameBuilder = [];

    if (this.options.showControls) {
      classNameBuilder.push('mp-min');
    } else {
      classNameBuilder.push('mp-no-controls');
    }

    return classNameBuilder.join(' ');
  }
}
