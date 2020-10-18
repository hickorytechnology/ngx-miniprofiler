import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DialogRef } from '@ngneat/dialog';
import { IGapInfo } from '../../models/gaps';
import { IProfiler } from '../../models/profiler';
import { ITiming } from '../../models/timing';
import { NgxMiniProfilerOptions } from '../../services/ngx-miniprofiler-options';

@Component({
  selector: 'ngx-miniprofiler-query-dialog',
  templateUrl: './ngx-miniprofiler-query-dialog.component.html',
  styleUrls: ['./ngx-miniprofiler-query-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxMiniProfilerQueryDialogComponent implements OnInit, OnDestroy {
  public profilerResult: IProfiler;
  public timing: ITiming;

  constructor(
    private dialogRef: DialogRef,
    private profilerOptions: NgxMiniProfilerOptions,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.profilerResult = this.dialogRef.data.profilerResult;
    this.timing = this.dialogRef.data.timing;
  }

  public ngOnDestroy(): void {}

  get options(): NgxMiniProfilerOptions {
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
