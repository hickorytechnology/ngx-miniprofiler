import {
  EnvironmentProviders,
  InjectionToken,
  Provider,
  Type,
  makeEnvironmentProviders,
} from '@angular/core';
import { Observable } from 'rxjs';
import { MiniProfilerDefaultOptions } from './default-options';
import { MiniProfilerAriaDialogContext } from './interfaces/mp-dialog';
import { ColorScheme, RenderPosition } from './models';

export const MINIPROFILER_CONFIG =
  new InjectionToken<MiniProfilerDefaultOptions>('config', {
    providedIn: 'root',
    factory() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return {} as any;
    },
  });

export function defaultGlobalConfig(): Partial<MiniProfilerDefaultOptions> {
  return {
    authorized: true,
    version: '',
    currentId: '',
    ids: [],
    colorScheme: ColorScheme.Light,
    ignoredDuplicateExecuteTypes: ['Open', 'OpenAsync', 'Close', 'CloseAsync'],
    maxTracesToShow: 15,
    renderPosition: RenderPosition.BottomRight,
    showChildrenTime: false,
    showControls: false,
    showTrivial: false,
    startHidden: false,
    toggleShortcut: 'Alt+P',
    trivialMilliseconds: 2,
    flushResultsOnRouteNavigate: true,
    queryDialogUI: 'default',
  };
}

export const GLOBAL_MINIPROFILER_CONFIG = new InjectionToken<
  Partial<MiniProfilerDefaultOptions>
>('Global MiniProfiler config token', {
  providedIn: 'root',
  factory() {
    return defaultGlobalConfig();
  },
});

export function provideMiniProfilerConfig(
  config: Partial<MiniProfilerDefaultOptions>
): EnvironmentProviders {
  const providers: Provider[] = [
    {
      provide: GLOBAL_MINIPROFILER_CONFIG,
      useFactory() {
        const defaultConfig = defaultGlobalConfig();
        return {
          ...defaultConfig,
          ...config,
        };
      },
    },
  ];

  return makeEnvironmentProviders(providers);
}

/**
 * A stream of dialogs
 */
export const MP_DIALOGS = new InjectionToken<
  ReadonlyArray<Observable<readonly MiniProfilerAriaDialogContext[]>>
>(`[MP_DIALOGS]`, {
  factory: () => [],
});

export function miniprofilerAsDialog(
  useExisting: Type<Observable<readonly MiniProfilerAriaDialogContext[]>>
): Provider {
  return {
    provide: MP_DIALOGS,
    multi: true,
    useExisting,
  };
}
