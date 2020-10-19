import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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
  public idsUpdated$: Observable<string[]>;
  public results$: Observable<IProfiler[]>;

  private miniProfilerIds: string[] = [];

  private subscriptions = new Subscription();

  constructor(
    private profilerService: NgxMiniprofilerService,
    private profilerOptions: NgxMiniProfilerOptions,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.idsUpdated$ = this.profilerService.idUpdated;
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
    return this.profilerService.fetchResults(ids);
  }

  get options(): NgxMiniProfilerOptions {
    return this.profilerOptions;
  }

  get controlsClassName(): string {
    return this.profilerOptions.showControls ? '' : 'mp-no-controls';
  }
}
