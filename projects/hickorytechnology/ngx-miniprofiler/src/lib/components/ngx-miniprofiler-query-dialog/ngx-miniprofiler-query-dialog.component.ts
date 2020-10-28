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
import { DialogRef } from '@ngneat/dialog';
import { registerLanguage, highlight } from 'highlight.js';
import { IGapInfo } from '../../models/gaps';
import { IProfiler } from '../../models/profiler';
import { ITiming } from '../../models/timing';
import { NgxMiniProfilerDefaultOptions, NGX_MINIPROFILER_DEFAULT_OPTIONS } from '../../ngx-miniprofiler-options';
import { sql } from '../../util/highlight_sql';

@Component({
  selector: 'ngx-miniprofiler-query-dialog',
  templateUrl: './ngx-miniprofiler-query-dialog.component.html',
  styleUrls: ['./ngx-miniprofiler-query-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NgxMiniProfilerQueryDialogComponent implements OnInit, OnDestroy {
  public profilerResult: IProfiler;
  public timing: ITiming;

  constructor(
    private dialogRef: DialogRef,
    private cdr: ChangeDetectorRef,
    @Optional()
    @Inject(NGX_MINIPROFILER_DEFAULT_OPTIONS)
    private profilerOptions: NgxMiniProfilerDefaultOptions
  ) {
    registerLanguage('sql', sql);
  }

  public ngOnInit(): void {
    this.profilerResult = this.dialogRef.data.profilerResult;
    this.timing = this.dialogRef.data.timing;
  }

  public ngOnDestroy(): void {}

  public get options(): NgxMiniProfilerDefaultOptions {
    return this.profilerOptions;
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

  public highlight(encoded: string): string {
    return highlight('sql', encoded).value;
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

  public gapClassName(gap: IGapInfo): string {
    const classNameBuilder: string[] = ['mp-gap-info'];

    if (gap.Reason.duration < 4) {
      classNameBuilder.push('mp-trivial-gap');
    }

    return classNameBuilder.join(' ');
  }
}
