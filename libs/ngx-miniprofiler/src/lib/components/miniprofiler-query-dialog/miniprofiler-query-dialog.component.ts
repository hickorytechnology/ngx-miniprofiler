import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { DialogRef } from '@ngneat/dialog';
import hljs from 'highlight.js/lib/core';
import { MiniProfilerDefaultOptions, NGX_MINIPROFILER_DEFAULT_OPTIONS } from '../../default-options';
import { IGapInfo, IProfiler, ITiming } from '../../models';
import { sql } from '../../util/highlight_sql';

@Component({
  selector: 'ht-miniprofiler-query-dialog',
  templateUrl: './miniprofiler-query-dialog.component.html',
  styleUrls: ['./miniprofiler-query-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MiniProfilerQueryDialogComponent implements OnInit {
  public profilerResult!: IProfiler;
  public timing!: ITiming;

  constructor(
    private dialogRef: DialogRef,
    private cdr: ChangeDetectorRef,
    @Optional()
    @Inject(NGX_MINIPROFILER_DEFAULT_OPTIONS)
    private profilerOptions: MiniProfilerDefaultOptions
  ) {
    hljs.registerLanguage('sql', sql);
  }

  public ngOnInit(): void {
    this.profilerResult = this.dialogRef.data.profilerResult;
    this.timing = this.dialogRef.data.timing;
  }

  public get options(): MiniProfilerDefaultOptions {
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
    return hljs.highlight('sql', encoded).value;
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

    if ((gap.Reason?.duration ?? 0) < 4) {
      classNameBuilder.push('mp-trivial-gap');
    }

    return classNameBuilder.join(' ');
  }
}
