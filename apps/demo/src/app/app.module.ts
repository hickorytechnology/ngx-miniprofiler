import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ColorScheme, MiniProfilerDefaultOptions, MiniProfilerInterceptor, NgxMiniprofilerModule, NGX_MINIPROFILER_DEFAULT_OPTIONS, RenderPosition } from '@hickorytechnology/ngx-miniprofiler';
import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [BrowserModule, CommonModule, RouterModule, RouterModule.forRoot([]), HttpClientModule, NgxMiniprofilerModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: MiniProfilerInterceptor, multi: true },
    {
      provide: NGX_MINIPROFILER_DEFAULT_OPTIONS,
      useValue: {
        api: 'https://localhost:5001/profiler',
        path: 'https://localhost:5001/profiler',
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
      } as MiniProfilerDefaultOptions,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
