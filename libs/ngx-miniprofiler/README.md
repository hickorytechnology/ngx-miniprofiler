# ngx-miniprofiler

A simple to use, highly configurable Angular port of the [MiniProfiler](https://miniprofiler.com/) library.

<img src="images/app-screenshot.png" height="240px">

## Installation

```bash
npm install --save @hickorytechnology/ngx-miniprofiler
```

Import the library within one of your primary application `NgModule` instances.

### `app.module.ts`

```typescript
@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    HttpClientModule,
    MiniProfilerModule.forRoot({
      api: '/profiler', // must be the MiniProfilr URL suffix from your backend
      path: '/profiler', // typically the same as above, but can be configured server-side
    }),
  ],
  providers: [
    // required to intercept MiniProfiler server-side HTTP requests
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MiniProfilerInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## Customization

`ngx-miniprofiler` includes multiple options to configure the library as you see fit. Most options have been carried over from the existing MiniProfiler project, however there have been several additions that take advantage of Angular-specific functionality.

```typescript
@NgModule({
  ...
  imports: [
    ...
    MiniProfilerModule.forRoot({
      api: '/profiler',
      path: '/profiler',
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
    }),
  ],
  ...
})
export class AppModule {}
```
