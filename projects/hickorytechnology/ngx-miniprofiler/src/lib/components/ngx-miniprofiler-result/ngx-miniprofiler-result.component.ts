import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { IProfiler } from '../../models/profiler';
import { NgxMiniProfilerDefaultOptions, NGX_MINIPROFILER_DEFAULT_OPTIONS } from '../../ngx-miniprofiler-options';

@Component({
  selector: 'ngx-miniprofiler-result',
  templateUrl: './ngx-miniprofiler-result.component.html',
  styleUrls: ['./ngx-miniprofiler-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NgxMiniProfilerResultComponent implements OnInit, OnDestroy {
  // @HostBinding('class')
  // rootClass: string;

  @Input()
  result: IProfiler;

  @Input()
  isNew = true;

  @Output()
  buttonClick = new EventEmitter();

  public showPopup = false;

  constructor(
    private cdr: ChangeDetectorRef,
    @Optional()
    @Inject(NGX_MINIPROFILER_DEFAULT_OPTIONS)
    private profilerOptions: NgxMiniProfilerDefaultOptions
  ) {}

  public ngOnInit(): void {}

  public ngOnDestroy(): void {}

  public get options(): NgxMiniProfilerDefaultOptions {
    return this.profilerOptions;
  }

  public get warningClassName(): string {
    return this.result.HasWarning ? 'mp-button-warning' : '';
  }

  public toggleShowPopup(): void {
    this.showPopup = !this.showPopup;
    this.cdr.markForCheck();
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

  // private buildRootClass(): void {
  //   const rootClassBuilder: string[] = ['mp-result'];
  //   if (this.profilerOptions.showTrivial) {
  //     rootClassBuilder.push('show-trivial');
  //   }

  //   if (this.profilerOptions.showChildrenTime) {
  //     rootClassBuilder.push('show-columns');
  //   }

  //   if (this.isNew) {
  //     rootClassBuilder.push('new');
  //   }

  //   if (this.showPopup) {
  //     rootClassBuilder.push('active');
  //   }

  //   this.rootClass = rootClassBuilder.join(' ');
  // }
}
