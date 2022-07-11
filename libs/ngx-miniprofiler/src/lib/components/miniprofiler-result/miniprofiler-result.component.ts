import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Optional, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { DialogRef } from '@ngneat/dialog';
import { Subscription } from 'rxjs';
import { MiniProfilerDefaultOptions, NGX_MINIPROFILER_DEFAULT_OPTIONS } from '../../default-options';
import { MiniProfilerService } from '../../services/miniprofiler.service';
import { IProfiler, RenderPosition } from '../../models';

@Component({
  selector: 'ht-miniprofiler-result',
  templateUrl: './miniprofiler-result.component.html',
  styleUrls: ['./miniprofiler-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MiniProfilerResultComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  result!: IProfiler;

  @Input()
  isNew = true;

  @Output()
  buttonClick = new EventEmitter();

  @ViewChild('buttonRef')
  buttonRef!: ElementRef;

  @ViewChild('popupRef')
  popupRef!: ElementRef;

  public showPopup = false;
  public showMoreColumns = false;
  public showTrivialTimings = false;
  public timingsDialogRef!: DialogRef;

  private readonly subscriptions = new Subscription();

  constructor(
    private profilerService: MiniProfilerService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    @Optional()
    @Inject(NGX_MINIPROFILER_DEFAULT_OPTIONS)
    private profilerOptions: MiniProfilerDefaultOptions
  ) { }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.profilerService.selectedProfilerResult.subscribe((id) => {
        if (id !== this.result.Id) {
          this.setShowPopup(false);
        }
      })
    );
  }

  ngAfterViewInit(): void {
    const button = this.buttonRef.nativeElement;
    const popup = this.popupRef.nativeElement;
    const pos = this.options.renderPosition;

    // move left or right, based on config
    this.renderer.setStyle(
      popup,
      pos === RenderPosition.Left || pos === RenderPosition.BottomLeft ? 'left' : 'right',
      `${button.offsetWidth - 1}px`
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

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public get options(): MiniProfilerDefaultOptions {
    return this.profilerOptions;
  }

  public get warningClassName(): string {
    return this.result.HasWarning ? 'mp-button-warning' : '';
  }

  public toggleShowPopup(): void {
    this.showPopup = !this.showPopup;

    if (this.showPopup) {
      this.profilerService.selectProfileResult(this.result.Id);
    } else {
      this.profilerService.selectProfileResult(null);

      if (this.timingsDialogRef != null) {
        this.timingsDialogRef.close();
      }
    }

    this.cdr.markForCheck();
  }

  public setShowPopup(showPopup: boolean): void {
    this.showPopup = showPopup;
    if (!showPopup && this.timingsDialogRef != null) {
      this.timingsDialogRef.close();
    }

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

  public onTimingsDialogOpen(dialogRef: DialogRef): void {
    this.timingsDialogRef = dialogRef;
  }

  public onToggleMoreColumns(showMoreColumns: boolean): void {
    this.showMoreColumns = showMoreColumns;
  }

  public onToggleTrivialTimings(showTrivialTimings: boolean): void {
    this.showTrivialTimings = showTrivialTimings;
  }
}
