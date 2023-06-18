import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  InjectionToken,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, ReplaySubject, combineLatest, of } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MiniProfilerDialog } from '../../interfaces/mp-dialog';
import { MP_DIALOGS } from '../../providers';

/**
 * Is closing dialog on browser backward navigation enabled
 */
export const MP_DIALOG_CLOSES_ON_BACK = new InjectionToken<Observable<boolean>>(
  '[MP_DIALOG_CLOSES_ON_BACK]',
  {
    factory: () => of(false),
  }
);

const FAKE_HISTORY_STATE = { label: 'ignoreMe' } as const;
const isFakeHistoryState = (
  historyState: Record<string, unknown>
): historyState is typeof FAKE_HISTORY_STATE =>
  historyState?.['label'] === FAKE_HISTORY_STATE.label;

@Component({
  selector: 'ht-dialog-host',
  templateUrl: './dialog-host.component.html',
  styleUrls: ['./dialog-host.component.scss'],
  // So that we do not force OnPush on custom dialogs
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MiniProfilerDialogHostComponent<
  T extends MiniProfilerDialog<unknown, unknown>
> implements OnInit, OnDestroy
{
  dialogs: readonly T[] = [];

  private readonly destroy$ = new ReplaySubject<void>();

  constructor(
    @Inject(MP_DIALOG_CLOSES_ON_BACK)
    readonly isDialogClosesOnBack$: Observable<boolean>,
    @Inject(MP_DIALOGS)
    private readonly dialogsByType: Array<Observable<readonly T[]>>,
    @Inject(ChangeDetectorRef) private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Due to this view being parallel to app content, `markForCheck` from `async` pipe
    // can happen after view was checked, so calling `detectChanges` instead
    combineLatest(this.dialogsByType)
      .pipe(
        map((arr) =>
          new Array<T>()
            .concat(...arr)
            .sort((a, b) => a.createdAt - b.createdAt)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((dialogs) => {
        this.dialogs = dialogs;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeLast(dialogs: readonly T[]): void {
    const [last] = dialogs.slice(-1);
    if (!last) {
      return;
    }

    // if (dialogs.length > 1) {
    //   this.historyRef.pushState(
    //     FAKE_HISTORY_STATE,
    //     this.titleService.getTitle()
    //   );
    // }

    last.$implicit.complete();
  }

  onDialog(
    { propertyName }: TransitionEvent,
    popupOpened: boolean,
    isDialogClosesOnBack: boolean
  ): void {
    if (!isDialogClosesOnBack || propertyName !== 'letter-spacing') {
      return;
    }

    // if (popupOpened) {
    //   this.historyRef.pushState(
    //     FAKE_HISTORY_STATE,
    //     this.titleService.getTitle()
    //   );
    // } else if (isFakeHistoryState(this.historyRef.state)) {
    //   this.historyRef.back();
    // }
  }
}
