import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IProfiler } from '../../models/profiler';
import { NgxMiniProfilerOptions } from '../../services/ngx-miniprofiler-options';
import { NgxMiniprofilerService } from '../../services/ngx-miniprofiler.service';

@Component({
  selector: 'ngx-miniprofiler',
  templateUrl: './ngx-miniprofiler.component.html',
  styleUrls: ['./ngx-miniprofiler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NgxMiniProfilerComponent implements OnInit, OnDestroy {
  constructor(
    private profilerService: NgxMiniprofilerService,
    private profilerOptions: NgxMiniProfilerOptions,
    private cdr: ChangeDetectorRef
  ) {}
  public idsUpdated$: Observable<string[]>;
  public results$: Observable<IProfiler[]>;
  public profileResults: IProfiler[] = [];

  private miniProfilerIds: string[] = [];

  private subscriptions = new Subscription();

  public ngOnInit(): void {
    this.idsUpdated$ = this.profilerService.idUpdated;
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public options(): NgxMiniProfilerOptions {
    return this.profilerOptions;
  }

  public idsChanged(ids: string[]): boolean {
    let result = false;
    if (this.miniProfilerIds.length !== ids.length) {
      result = true;
    }

    this.miniProfilerIds = ids;
    return result;
  }

  public fetchResults(ids: string[]): Observable<IProfiler[]> {
    return this.profilerService.fetchResults(ids).pipe(
      switchMap((results) => {
        let formatted = this.profileResults;
        formatted = formatted
          .concat(results.slice(1))
          .sort((x, y) => new Date(x.Started).getTime() - new Date(y.Started).getTime())
          .reverse();
        this.profileResults = formatted;
        return of(formatted);
      })
    );
  }
}
