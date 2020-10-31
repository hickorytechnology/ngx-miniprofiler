import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IProfiler } from '../../models/profiler';
import { NgxMiniProfilerDefaultOptions, NGX_MINIPROFILER_DEFAULT_OPTIONS } from '../../ngx-miniprofiler-options';
import { NgxMiniProfilerService } from '../../services/ngx-miniprofiler.service';

@Component({
  selector: 'ngx-miniprofiler',
  templateUrl: './ngx-miniprofiler.component.html',
  styleUrls: ['./ngx-miniprofiler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NgxMiniProfilerComponent implements OnInit, OnDestroy {
  constructor(
    private profilerService: NgxMiniProfilerService,
    private cdr: ChangeDetectorRef,
    @Optional()
    @Inject(NGX_MINIPROFILER_DEFAULT_OPTIONS)
    private profilerOptions: NgxMiniProfilerDefaultOptions
  ) {}

  public results$: Observable<IProfiler[]>;
  public profileResults: IProfiler[] = [];

  private subscriptions = new Subscription();

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

  public get options(): NgxMiniProfilerDefaultOptions {
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
