import { DOCUMENT } from '@angular/common';
import {
  ElementRef,
  Inject,
  Injectable,
  InjectionToken,
  inject,
} from '@angular/core';
import {
  EMPTY,
  Observable,
  filter,
  fromEvent,
  map,
  merge,
  switchMap,
  take,
} from 'rxjs';

const SCROLLBAR_PLACEHOLDER = 17;

const WINDOW = new InjectionToken<Window>(
  'An abstraction over global window object',
  {
    factory: () => {
      const { defaultView } = inject(DOCUMENT);
      if (!defaultView) {
        throw new Error('Window is not available');
      }
      return defaultView;
    },
  }
);

/**
 * A stream to close dialogs
 */
export const MP_DIALOGS_CLOSE = new InjectionToken<Observable<unknown>>(
  `[MP_DIALOGS_CLOSE]`,
  {
    factory: () => EMPTY,
  }
);

@Injectable()
export class MiniProfilerDialogCloseService extends Observable<unknown> {
  private readonly esc$ = fromEvent<KeyboardEvent>(this.doc, 'keydown').pipe(
    filter((event) => {
      const target = this.getActualTarget(event);

      return (
        event.key === `Escape` &&
        (this.element.contains(target) || this.isOutside(target))
      );
    })
  );

  private readonly mousedown$ = fromEvent<MouseEvent>(
    this.doc,
    `mousedown`
  ).pipe(
    filter(
      (event) =>
        this.getViewportWidth(this.win) - event.clientX >
          SCROLLBAR_PLACEHOLDER && this.isOutside(this.getActualTarget(event))
    ),
    switchMap(() =>
      fromEvent<MouseEvent>(this.doc, `mouseup`).pipe(
        take(1),
        map(this.getActualTarget),
        filter((target) => this.isOutside(target))
      )
    )
  );

  constructor(
    @Inject(WINDOW) private readonly win: Window,
    @Inject(DOCUMENT) private readonly doc: Document,
    @Inject(ElementRef) private readonly el: ElementRef<HTMLElement>
  ) {
    super((subscriber) =>
      merge(this.esc$, this.mousedown$).subscribe(subscriber)
    );
  }

  private get element(): HTMLElement {
    return this.el.nativeElement;
  }

  private isOutside(target: EventTarget): boolean {
    return (
      this.isElement(target) &&
      (!this.containsOrAfter(this.element, target) || target === this.element)
    );
  }

  /**
   * Gets actual target from open Shadow DOM if event happened within it
   */
  private getActualTarget(event: Event): Node {
    return event.composedPath()[0] as Node;
  }

  /**
   * @description:
   * Cross-browser @media (width)
   *
   * 1. window.innerWidth
   * 1.1. gets CSS viewport @media (width) which include scrollbars
   * 1.2. initial-scale and zoom variations may cause mobile values to
   *      wrongly scale down to what PPK calls the visual
   *      viewport and be smaller than the @media values
   *  1.3. zoom may cause values to be 1px off due to native rounding
   *
   *  2. document.documentElement.clientWidth
   *  2.1. equals CSS viewport width minus scrollbar width
   *  2.2. matches @media (width) when there is no scrollbar
   *  2.3. available cross-browser
   *  2.4. inaccurate if doctype is missing
   */
  private getViewportWidth({ document, innerWidth }: Window): number {
    return Math.max(document.documentElement.clientWidth || 0, innerWidth || 0);
  }

  private isElement(
    node?: Element | EventTarget | Node | null
  ): node is Element {
    return !!node && `nodeType` in node && node.nodeType === Node.ELEMENT_NODE;
  }

  private containsOrAfter(current: Node, node: Node): boolean {
    try {
      return (
        current.contains(node) ||
        !!(
          node.compareDocumentPosition(current) &
          Node.DOCUMENT_POSITION_PRECEDING
        )
      );
    } catch {
      return false;
    }
  }
}
