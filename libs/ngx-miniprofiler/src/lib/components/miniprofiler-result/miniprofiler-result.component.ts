import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MiniProfilerDefaultOptions } from '../../default-options';
import { IProfiler, RenderPosition } from '../../models';
import { GLOBAL_MINIPROFILER_CONFIG } from '../../providers';
import { MiniProfilerService } from '../../services/miniprofiler.service';

@Component({
  selector: 'ht-miniprofiler-result',
  templateUrl: './miniprofiler-result.component.html',
  styleUrls: ['./miniprofiler-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MiniProfilerResultComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input()
  public result!: IProfiler;

  @Input()
  public isNew = true;

  @Output()
  public buttonClick = new EventEmitter();

  @ViewChild('buttonRef')
  public buttonRef!: ElementRef;

  @ViewChild('popupRef')
  public popupRef!: ElementRef;

  public showPopup = false;
  public showMoreColumns = false;
  public showTrivialTimings = false;
  public highlightActive = true;

  private readonly subscriptions = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(GLOBAL_MINIPROFILER_CONFIG)
    private profilerOptions: MiniProfilerDefaultOptions,
    private profilerService: MiniProfilerService,
    private renderer: Renderer2
  ) {}

  public ngOnInit(): void {
    this.subscriptions.add(
      this.profilerService.selectedProfilerResult.subscribe((id) => {
        if (id !== this.result.Id) {
          this.setShowPopup(false);
        }
      })
    );

    /**
     * The highlight animation is two seconds long, so wait that amount of time (plus a bit of padding)
     * before marking the highlight animation as inactive.
     *
     * This prevents an issue where the highlight will return after clicking a result button (background
     * color changes from blue back to white).
     */
    setTimeout(() => {
      this.highlightActive = false;
    }, 2100);
  }

  public ngAfterViewInit(): void {
    const button = this.buttonRef.nativeElement;
    const popup = this.popupRef.nativeElement;
    const pos = this.profilerOptions.renderPosition;

    // move left or right, based on config
    this.renderer.setStyle(
      popup,
      pos === RenderPosition.Left || pos === RenderPosition.BottomLeft
        ? 'left'
        : 'right',
      `${button.offsetWidth - 1}px`
    );

    if (
      pos === RenderPosition.BottomLeft ||
      pos === RenderPosition.BottomRight
    ) {
      // calculate get the mp-button's offsets
      const bottom =
        window.innerHeight -
        button.getBoundingClientRect().top -
        button.offsetHeight +
        window.scrollY;

      this.renderer.setStyle(popup, 'bottom', 0);
      this.renderer.setStyle(
        popup,
        'max-height',
        `calc(100vh - ${bottom + 25}px)`
      );
    } else {
      this.renderer.setStyle(popup, 'top', 0);
      this.renderer.setStyle(
        popup,
        'max-height',
        `calc(100vh - ${
          button.getBoundingClientRect().top - window.window.scrollY + 25
        }px)`
      );
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public toggleShowPopup(): void {
    this.showPopup = !this.showPopup;

    if (this.showPopup) {
      this.profilerService.selectProfileResult(this.result.Id);
    } else {
      this.profilerService.selectProfileResult(null);

      // if (this.timingsDialogRef != null) {
      //   this.timingsDialogRef.close();
      // }
    }

    this.cdr.markForCheck();
  }

  public setShowPopup(showPopup: boolean): void {
    this.showPopup = showPopup;
    // if (!showPopup && this.timingsDialogRef != null) {
    //   this.timingsDialogRef.close();
    // }

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
  public duration(
    milliseconds: number | undefined,
    decimalPlaces?: number
  ): string {
    if (milliseconds === undefined) {
      return '';
    }
    return (milliseconds || 0).toFixed(
      decimalPlaces === undefined ? 1 : decimalPlaces
    );
  }

  // public onTimingsDialogOpen(dialogRef: DialogRef): void {
  //   this.timingsDialogRef = dialogRef;
  // }

  public onToggleMoreColumns(showMoreColumns: boolean): void {
    this.showMoreColumns = showMoreColumns;
  }

  public onToggleTrivialTimings(showTrivialTimings: boolean): void {
    this.showTrivialTimings = showTrivialTimings;
  }
}
