import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { IProfiler } from '../../models/profiler';
import { RenderPosition } from '../../models/render-position.enum';
import { NgxMiniProfilerDefaultOptions, NGX_MINIPROFILER_DEFAULT_OPTIONS } from '../../ngx-miniprofiler-options';

@Component({
  selector: 'ngx-miniprofiler-result',
  templateUrl: './ngx-miniprofiler-result.component.html',
  styleUrls: ['./ngx-miniprofiler-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NgxMiniProfilerResultComponent implements OnInit, OnDestroy, AfterViewInit {
  // @HostBinding('class')
  // rootClass: string;

  @Input()
  result: IProfiler;

  @Input()
  isNew = true;

  @Output()
  buttonClick = new EventEmitter();

  @ViewChild('buttonRef')
  buttonRef: ElementRef;

  @ViewChild('popupRef')
  popupRef: ElementRef;

  public showPopup = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    @Optional()
    @Inject(NGX_MINIPROFILER_DEFAULT_OPTIONS)
    private profilerOptions: NgxMiniProfilerDefaultOptions
  ) {}

  public ngOnInit(): void {}

  ngAfterViewInit(): void {
    const button = this.buttonRef.nativeElement;
    const popup = this.popupRef.nativeElement;
    const pos = this.options.renderPosition;

    // move left or right, based on config
    this.renderer.setStyle(
      popup,
      pos === RenderPosition.Left || pos === RenderPosition.BottomLeft ? 'left' : 'right',
      button.offsetWidth - 1
    );

    if (pos === RenderPosition.BottomLeft || pos === RenderPosition.BottomRight) {
      // calculate get the mp-button's offsets
      const bottom = window.innerHeight - button.getBoundingClientRect().top - button.offsetHeight + window.scrollY;

      this.renderer.setStyle(popup, 'bottom', 0);
      this.renderer.setStyle(popup, 'max-height', `calc(100vh - ${bottom + 25}px)`);
    } else {
      this.renderer.setStyle(popup, 'top', 0);
      this.renderer.setStyle(
        popup,
        'max-height',
        `calc(100vh - ${button.getBoundingClientRect().top - window.window.scrollY + 25}px)`
      );
    }
  }

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
