import { InjectionToken } from '@angular/core';
import { ColorScheme, RenderPosition } from './models';

/**
 * Default options that can be overridden.
 */
export interface MiniProfilerDefaultOptions {
  api: string;
  path: string;
  authorized: boolean;
  version: string;

  /**
   * Determines which color scheme to use when rendering (the class to apply for CSS styling).
   */
  colorScheme: ColorScheme;
  currentId: string;
  ids: string[];

  /**
   * Custom timing ExecuteTypes to ignore as duplicates in the UI.
   */
  ignoredDuplicateExecuteTypes: string[];

  /**
   * Determines how many traces to show before removing the oldest; defaults to 15.
   */
  maxTracesToShow: number;

  /**
   * Dictates on which side of the page the profiler popup button is displayed; defaults to left.
   */
  renderPosition: RenderPosition;

  /**
   * Dictates if the "time with children" column is displayed by default, defaults to false.
   */
  showChildrenTime: boolean;

  /**
   * Determines if min-max, clear, etc are rendered; defaults to false.
   */
  showControls: boolean;

  /**
   * Dictates if trivial timings are displayed by default, defaults to false.
   */
  showTrivial: boolean;

  /**
   * When true, results buttons will not initially be shown, requiring keyboard activation via {@link toggleShortcut}.
   */
  startHidden: boolean;

  /**
   * Allows showing/hiding of popup results buttons via keyboard.
   * Defaults to "Alt+P".
   */
  toggleShortcut: string;

  /**
   * Any Timing step with a duration less than or equal to this will be hidden by default in the UI; defaults to 2.0 ms.
   */
  trivialMilliseconds: number;

  /**
   * Whether or not profiler results should be flushed when the user navigates
   * to a new route within their application.
   */
  flushResultsOnRouteNavigate: boolean;
}

/**
 * Injection token to be used to override the default options.
 */
export const NGX_MINIPROFILER_DEFAULT_OPTIONS = new InjectionToken<MiniProfilerDefaultOptions>(
  'ngx-miniprofiler-default-options',
  {
    providedIn: 'root',
    factory: NGX_MINIPROFILER_DEFAULT_OPTIONS_FACTORY,
  }
);

export function NGX_MINIPROFILER_DEFAULT_OPTIONS_FACTORY(): MiniProfilerDefaultOptions {
  return {
    api: '/profiler',
    path: '/profiler',
    authorized: true,
    version: '',
    currentId: '',
    ids: [],
    colorScheme: ColorScheme.Light,
    ignoredDuplicateExecuteTypes: ['Open', 'OpenAsync', 'Close', 'CloseAsync'],
    maxTracesToShow: 15,
    renderPosition: RenderPosition.Left,
    showChildrenTime: false,
    showControls: false,
    showTrivial: false,
    startHidden: false,
    toggleShortcut: 'Alt+P',
    trivialMilliseconds: 2,
    flushResultsOnRouteNavigate: false,
  };
}
