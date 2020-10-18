import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { IGapInfo } from '../../models/gaps';
import { IProfiler } from '../../models/profiler';
import { NgxMiniProfilerOptions } from '../../services/ngx-miniprofiler-options';

@Component({
  selector: 'ngx-miniprofiler-result',
  templateUrl: './ngx-miniprofiler-result.component.html',
  styleUrls: ['./ngx-miniprofiler-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxMiniProfilerResultComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  rootClass: string;

  @Input()
  result: IProfiler;

  @Input()
  isNew = true;

  constructor(private profilerOptions: NgxMiniProfilerOptions, private cdr: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.buildRootClass();
  }

  public ngOnDestroy(): void {}

  public get options(): NgxMiniProfilerOptions {
    return this.profilerOptions;
  }

  public get warningClassName(): string {
    return this.result.HasWarning ? 'mp-button-warning' : '';
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

  private buildRootClass(): void {
    const rootClassBuilder: string[] = ['mp-result'];
    if (this.profilerOptions.showTrivial) {
      rootClassBuilder.push('show-trivial');
    }

    if (this.profilerOptions.showChildrenTime) {
      rootClassBuilder.push('show-columns');
    }

    if (this.isNew) {
      rootClassBuilder.push('new');
    }

    this.rootClass = rootClassBuilder.join(' ');
  }

  public gapClassName(gap: IGapInfo): string {
    const classNameBuilder: string[] = ['mp-gap-info'];

    if (gap.Reason.duration < 4) {
      classNameBuilder.push('mp-trivial-gap');
    }

    return classNameBuilder.join(' ');
  }
}
