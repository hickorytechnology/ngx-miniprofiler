import { Injectable } from '@angular/core';
import { ColorScheme } from '../models/color-scheme.enum';
import { RenderPosition } from '../models/render-position.enum';

@Injectable()
export class NgxMiniProfilerOptions {
  api = '/profiler';
  path = '/profiler';
  authorized = true;
  version: string;

  /**
   * Determines which color scheme to use when rendering (the class to apply for CSS styling).
   */
  colorScheme: ColorScheme = ColorScheme.Light;
  currentId: string;
  ids: string[];

  /**
   * Custom timing ExecuteTypes to ignore as duplicates in the UI.
   */
  ignoredDuplicateExecuteTypes: string[] = ['Open', 'OpenAsync', 'Close', 'CloseAsync'];

  /**
   * Determines how many traces to show before removing the oldest; defaults to 15.
   */
  maxTracesToShow = 15;

  /**
   * Dictates on which side of the page the profiler popup button is displayed; defaults to left.
   */
  renderPosition: RenderPosition = RenderPosition.Left;

  /**
   * Dictates if the "time with children" column is displayed by default, defaults to false.
   */
  showChildrenTime = false;

  /**
   * Determines if min-max, clear, etc are rendered; defaults to false.
   */
  showControls: boolean;

  /**
   * Dictates if trivial timings are displayed by default, defaults to false.
   */
  showTrivial = false;

  /**
   * When true, results buttons will not initially be shown, requiring keyboard activation via {@link toggleShortcut}.
   */
  startHidden = false;

  /**
   * Allows showing/hiding of popup results buttons via keyboard.
   * Defaults to "Alt+P".
   */
  toggleShortcut = 'Alt+P';

  /**
   * Any Timing step with a duration less than or equal to this will be hidden by default in the UI; defaults to 2.0 ms.
   */
  trivialMilliseconds = 2;
}
