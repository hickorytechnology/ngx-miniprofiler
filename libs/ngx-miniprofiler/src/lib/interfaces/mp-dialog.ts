import { Observable, Observer } from 'rxjs';
import {
  PolymorpheusComponent,
  PolymorpheusContent,
} from '../cdk/polymorpheus';
import { IProfiler, ITiming } from '../models';

export interface MiniProfilerAriaDialogContext {
  readonly component: PolymorpheusComponent<any>;
  readonly id: string;
  readonly createdAt: number;
}

export interface MiniProfilerDialogContextWithImplicit<T> {
  $implicit: T;
}

export interface MiniProfilerBaseDialogContext<O>
  extends MiniProfilerDialogContextWithImplicit<Observer<O>>,
    MiniProfilerAriaDialogContext {
  readonly completeWith: (value: O) => void;
}

export interface MiniProfilerBaseDialog<
  O,
  I extends MiniProfilerBaseDialogContext<O>
> {
  readonly content: PolymorpheusContent<I>;
  readonly observer: Observer<O>;
}

export interface MiniProfilerDialogContext<O = void, I = undefined>
  extends MiniProfilerBaseDialogContext<O>,
    MiniProfilerDialogOptions<I> {}

export type MiniProfilerDialog<T, O> = T &
  MiniProfilerBaseDialogContext<O> & {
    content: PolymorpheusContent<T & MiniProfilerBaseDialogContext<O>>;
  };

/**
 * Options for a dialog
 *
 * size - size of the dialog ('m' by default)
 * required - closing dialog throws (false by default)
 * closeable - show close button (true by default)
 * dismissible - close dialog by Esc button or click on overlay (true by default)
 * label - string title for the dialog ('' by default)
 * header - content above title ('' by default)
 * data - arbitrary data for dialog (undefined by default)
 */
export interface MiniProfilerDialogOptions<I> {
  readonly size: 's' | 'm' | 'l' | 'xs' | 'xl' | 'xxl' | 'fullscreen';
  readonly required: boolean;
  readonly closeable: Observable<boolean> | boolean;
  readonly dismissible: Observable<boolean> | boolean;
  readonly label: string;
  readonly header: PolymorpheusContent<
    MiniProfilerDialog<MiniProfilerDialogOptions<I>, any>
  >;
  readonly data: I | undefined;
}

export interface MiniProfilerDialogData {
  profilerResult: IProfiler;
  timing: ITiming;
}
