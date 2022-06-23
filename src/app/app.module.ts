import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  NgxMiniProfilerInterceptor,
  NgxMiniProfilerModule,
  NGX_MINIPROFILER_DEFAULT_OPTIONS,
} from '@hickorytechnology/ngx-miniprofiler';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, NgxMiniProfilerModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: NgxMiniProfilerInterceptor, multi: true },
    {
      provide: NGX_MINIPROFILER_DEFAULT_OPTIONS,
      useValue: {
        api: '/api/profiler/',
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
