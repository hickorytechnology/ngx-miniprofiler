import {
  ChangeDetectorRef,
  Directive,
  Inject,
  Input,
  TemplateRef,
} from '@angular/core';
import { Subject, endWith, ignoreElements, share, switchMap } from 'rxjs';
import { PolymorpheusTemplate } from '../cdk/polymorpheus';
import {
  MiniProfilerDialog,
  MiniProfilerDialogOptions,
} from '../interfaces/mp-dialog';
import {
  AbstractMiniProfilerDialogService,
  MiniProfilerDialogService,
} from '../services/dialog.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ng-template[mpDialog]',
  providers: [
    {
      provide: AbstractMiniProfilerDialogService,
      useExisting: MiniProfilerDialogService,
    },
  ],
})
export class MiniProfilerDialogDirective<T> extends PolymorpheusTemplate<
  MiniProfilerDialog<MiniProfilerDialogOptions<T>, void>
> {
  private _options: Partial<T> = {};
  private readonly open$ = new Subject<boolean>();

  @Input('mpDialogOptions')
  public get options() {
    return this._options;
  }
  public set options(value: Partial<T>) {
    this._options = value;
  }

  @Input('mpDialog')
  public set open(open: boolean) {
    this.open$.next(open);
  }

  public openChange = this.open$.pipe(
    switchMap(() => {
      return this.service
        .open(this, this.options)
        .pipe(ignoreElements(), endWith(false));
    }),
    share()
  );

  constructor(
    @Inject(TemplateRef)
    templateRef: TemplateRef<
      MiniProfilerDialog<MiniProfilerDialogOptions<T>, void>
    >,
    @Inject(ChangeDetectorRef) cdr: ChangeDetectorRef,
    @Inject(AbstractMiniProfilerDialogService)
    private readonly service: AbstractMiniProfilerDialogService<T>
  ) {
    super(templateRef, cdr);
  }
}
