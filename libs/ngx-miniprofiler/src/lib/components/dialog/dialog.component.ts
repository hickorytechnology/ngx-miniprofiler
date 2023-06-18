import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Inject,
  OnDestroy,
} from '@angular/core';
import {
  Observable,
  ReplaySubject,
  Subject,
  isObservable,
  merge,
  of,
} from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import {
  POLYMORPHEUS_CONTEXT,
  PolymorpheusContent,
} from '../../cdk/polymorpheus';
import {
  MiniProfilerDialog,
  MiniProfilerDialogOptions,
} from '../../interfaces/mp-dialog';
import {
  MP_DIALOGS_CLOSE,
  MiniProfilerDialogCloseService,
} from '../../services/dialog-close.service';

const REQUIRED_ERROR = new Error('Required dialog was dismissed');

@Component({
  selector: 'ht-mp-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  // So we don't force OnPush on dialog content
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [MiniProfilerDialogCloseService],
})
export class MiniProfilerDialogComponent<O, I> implements OnDestroy {
  readonly close$ = new Subject();

  private readonly destroy$ = new ReplaySubject<void>();

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    readonly context: MiniProfilerDialog<MiniProfilerDialogOptions<I>, O>,
    @Inject(MiniProfilerDialogCloseService) dialogClose$: Observable<unknown>,
    @Inject(MP_DIALOGS_CLOSE) close$: Observable<unknown>
  ) {
    merge(
      this.close$.pipe(switchMap(() => toObservable(context.closeable))),
      dialogClose$.pipe(switchMap(() => toObservable(context.dismissible))),
      close$.pipe(map(() => true))
    )
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe(() => {
        this.close();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostBinding('attr.data-size')
  get size() {
    return this.context.size;
  }

  @HostBinding('class._centered')
  get header(): PolymorpheusContent<
    MiniProfilerDialog<MiniProfilerDialogOptions<I>, O>
  > {
    return this.context.header;
  }

  private close(): void {
    if (this.context.required) {
      this.context.$implicit.error(REQUIRED_ERROR);
    } else {
      this.context.$implicit.complete();
    }
  }
}

function toObservable<T>(valueOrStream: Observable<T> | T): Observable<T> {
  return isObservable(valueOrStream) ? valueOrStream : of(valueOrStream);
}
