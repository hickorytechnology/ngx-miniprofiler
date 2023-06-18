/**
 * Liberally ripped off of the ng-polymorpheus project (https://github.com/Tinkoff/ng-polymorpheus)
 * but packaged in here as slight modifications were made to simplify the passing of dialog
 * context data.
 */

import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  DoCheck,
  EmbeddedViewRef,
  InjectionToken,
  Injector,
  OnChanges,
  Self,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { SafeValue } from '@angular/platform-browser';

export class PolymorpheusContext<T> {
  constructor(readonly $implicit: T) {}

  get polymorpheusOutlet(): T {
    return this.$implicit;
  }
}

/**
 * Use this token to access context within your components when
 * instantiating them through {@link PolymorpheusOutletDirective}
 */
export const POLYMORPHEUS_CONTEXT = new InjectionToken<Record<any, any>>(
  'POLYMORPHEUS_CONTEXT'
);

/**
 * Wrapper class for a component that will be used as content for {@link PolymorpheusOutletDirective}
 *
 * @param component — an Angular component to be dynamically created
 * @param injector — optional {@link Injector} for lazy loaded module case
 *
 * TODO: Remove second generic as it is irrelevant, remove `null` from injector type
 */
export class PolymorpheusComponent<T, _C = any> {
  constructor(
    readonly component: Type<T>,
    private readonly i?: Injector | null
  ) {}

  createInjector<C>(injector: Injector, useValue?: C): Injector {
    return Injector.create({
      parent: this.i || injector,
      providers: [
        {
          provide: POLYMORPHEUS_CONTEXT,
          useValue,
        },
      ],
    });
  }
}

/**
 * ng-template wrapper directive also stores {@link ChangeDetectorRef} to properly handle change detection.
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ng-template[polymorpheus]',
  exportAs: 'polymorpheus',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['polymorpheus'],
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class PolymorpheusTemplate<C = any> {
  polymorpheus: C | '' = '';

  constructor(
    @Self() readonly template: TemplateRef<C>,
    private readonly cdr: ChangeDetectorRef
  ) {}

  check(): void {
    this.cdr.markForCheck();
  }

  static ngTemplateContextGuard<T>(
    _dir: PolymorpheusTemplate<T>,
    _ctx: any
  ): _ctx is T extends '' ? any : T {
    return true;
  }
}

/**
 * Primitive types used as content by {@link PolymorpheusOutletDirective}
 */
export type PolymorpheusPrimitive =
  | string
  | number
  | SafeValue
  | null
  | undefined;

/**
 * A handler function receiving context as input and returning a primitive
 */
export type PolymorpheusHandler<C> = (context: C) => PolymorpheusPrimitive;

/**
 * All content types supported by {@link PolymorpheusOutletDirective}
 */
export type PolymorpheusContent<C = any> =
  | TemplateRef<Partial<C>>
  | PolymorpheusTemplate<Partial<C> | ''> // string is untyped, e.g. 'any'
  | PolymorpheusComponent<unknown>
  | PolymorpheusHandler<C>
  | PolymorpheusPrimitive;

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[polymorpheusOutlet]',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['content: polymorpheusOutlet', 'context: polymorpheusOutletContext'],
})
export class PolymorpheusOutletDirective<C> implements OnChanges, DoCheck {
  private v?: EmbeddedViewRef<unknown>;
  private c?: ComponentRef<unknown>;

  content: PolymorpheusContent<C> = '';
  context?: C;

  constructor(
    private readonly vcr: ViewContainerRef,
    private readonly i: Injector,
    private readonly t: TemplateRef<PolymorpheusContext<PolymorpheusPrimitive>>
  ) {}

  private get template(): TemplateRef<unknown> {
    if (isDirective(this.content)) {
      return this.content.template;
    }

    return this.content instanceof TemplateRef ? this.content : this.t;
  }

  ngOnChanges({ content }: SimpleChanges): void {
    const context = this.getContext();

    if (this.v) {
      this.v.context = context;
    }

    this.c?.injector.get(ChangeDetectorRef).markForCheck();

    if (!content) {
      return;
    }

    this.vcr.clear();

    if (isComponent(this.content)) {
      this.process(this.content);
    } else if (
      // tslint:disable-next-line:triple-equals
      (context instanceof PolymorpheusContext && context.$implicit) != null
    ) {
      this.v = this.vcr.createEmbeddedView(this.template, context);
    }
  }

  ngDoCheck() {
    if (isDirective(this.content)) {
      this.content.check();
    }
  }

  static ngTemplateContextGuard<T>(
    _dir: PolymorpheusOutletDirective<T>,
    _ctx: any
  ): _ctx is PolymorpheusContext<string> {
    return true;
  }

  private getContext(): unknown {
    if (isTemplate(this.content) || isComponent(this.content)) {
      return this.context;
    }

    return new PolymorpheusContext(
      typeof this.content === 'function'
        ? this.content(this.context!)
        : this.content
    );
  }

  private process(content: PolymorpheusComponent<unknown>): void {
    const injector = content.createInjector(
      this.i,
      this.context &&
        (new Proxy(this.context as unknown as object, {
          get: (_, key) => this.context?.[key as keyof C],
        }) as unknown as C)
    );

    this.c = this.vcr.createComponent(
      injector
        .get(ComponentFactoryResolver)
        .resolveComponentFactory(content.component),
      0,
      injector
    );
  }
}

function isDirective<C>(
  content: PolymorpheusContent<C>
): content is PolymorpheusTemplate<C> {
  return content instanceof PolymorpheusTemplate;
}

function isComponent<C>(
  content: PolymorpheusContent<C>
): content is PolymorpheusComponent<any, C> {
  return content instanceof PolymorpheusComponent;
}

function isTemplate<C>(
  content: PolymorpheusContent<C>
): content is PolymorpheusTemplate<C> | TemplateRef<C> {
  return isDirective(content) || content instanceof TemplateRef;
}
