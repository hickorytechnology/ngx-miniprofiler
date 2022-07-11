import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { Observable, of, Subscription, switchMap } from 'rxjs';
import { MiniProfilerDefaultOptions, NGX_MINIPROFILER_DEFAULT_OPTIONS } from '../../default-options';
import { MiniProfilerService } from '../../services/miniprofiler.service';
import { IProfiler } from '../../models';

@Component({
  selector: 'ht-miniprofiler',
  templateUrl: './miniprofiler.component.html',
  styleUrls: ['./miniprofiler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MiniProfilerComponent implements OnInit, OnDestroy {
  constructor(
    private profilerService: MiniProfilerService,
    private cdr: ChangeDetectorRef,
    @Optional()
    @Inject(NGX_MINIPROFILER_DEFAULT_OPTIONS)
    private profilerOptions: MiniProfilerDefaultOptions
  ) { }

  public results$: Observable<IProfiler[]> = of();
  public profileResults: IProfiler[] = [];

  private readonly subscriptions = new Subscription();

  public ngOnInit(): void {
    this.subscriptions.add(
      this.profilerService.idUpdated
        .pipe(
          switchMap((ids) => {
            return this.profilerService.fetchResults(ids).pipe(
              switchMap((results) => {
                let formatted = this.profileResults;
                formatted = formatted
                  .concat(results)
                  .sort((x, y) => new Date(x.Started).getTime() - new Date(y.Started).getTime());

                if (this.options.maxTracesToShow > 0) {
                  formatted = formatted.slice(Math.max(formatted.length - this.options.maxTracesToShow, 0));
                }

                this.profileResults = formatted;
                this.cdr.markForCheck();
                return of(formatted);
              })
            );
          })
        )
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
