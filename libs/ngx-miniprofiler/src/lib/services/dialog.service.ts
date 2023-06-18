import { Inject, Injectable, InjectionToken, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  PolymorpheusComponent,
  PolymorpheusContent,
} from '../cdk/polymorpheus';
import { MiniProfilerDialogComponent } from '../components/dialog/dialog.component';
import {
  MiniProfilerBaseDialogContext,
  MiniProfilerDialog,
  MiniProfilerDialogOptions,
} from '../interfaces/mp-dialog';
import { MiniProfilerIdService } from './id.service';

const DIALOG = new PolymorpheusComponent(MiniProfilerDialogComponent);

type MiniProfilerDialogDefaultOptions = Omit<
  MiniProfilerDialogOptions<unknown>,
  'data'
>;

/**
 * Default parameters for dialog component
 */
export const MP_DIALOG_OPTIONS =
  new InjectionToken<MiniProfilerDialogDefaultOptions>(`[MP_DIALOG_OPTIONS]`, {
    factory: () => ({
      size: `m`,
      required: false,
      closeable: true,
      dismissible: true,
      label: ``,
      header: ``,
    }),
  });

@Injectable()
export abstract class AbstractMiniProfilerDialogService<
  T,
  K = void
> extends Observable<ReadonlyArray<MiniProfilerDialog<T, any>>> {
  protected abstract readonly component: PolymorpheusComponent<
    any,
    MiniProfilerDialog<T, any>
  >;

  protected abstract readonly defaultOptions: T;

  protected readonly dialogs$ = new BehaviorSubject<
    ReadonlyArray<MiniProfilerDialog<T, any>>
  >([]);

  constructor(
    @Inject(MiniProfilerIdService)
    private readonly idService: MiniProfilerIdService
  ) {
    super((observer) => this.dialogs$.subscribe(observer));
  }

  open<G = void>(
    content: PolymorpheusContent<
      T & MiniProfilerBaseDialogContext<K extends void ? G : K>
    >,
    options: Partial<T> = {}
  ): Observable<K extends void ? G : K> {
    return new Observable((observer) => {
      const completeWith = (result: K extends void ? G : K): void => {
        observer.next(result);
        observer.complete();
      };
      const dialog = {
        ...this.defaultOptions,
        ...options,
        content,
        completeWith,
        $implicit: observer,
        component: this.component,
        createdAt: Date.now(),
        id: this.idService.generate(),
      };

      this.dialogs$.next([...this.dialogs$.value, dialog]);

      return () => {
        this.dialogs$.next(
          this.dialogs$.value.filter((item) => item !== dialog)
        );
      };
    });
  }
}

@Injectable({
  providedIn: `root`,
})
export class MiniProfilerDialogService extends AbstractMiniProfilerDialogService<
  MiniProfilerDialogOptions<any>
> {
  protected readonly component = DIALOG;
  protected readonly defaultOptions: MiniProfilerDialogOptions<any> = {
    ...inject(MP_DIALOG_OPTIONS),
    data: undefined,
  };
}
