import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  NgxMiniProfilerInterceptor,
  NgxMiniprofilerModule,
  NgxMiniProfilerOptions,
} from '@hickorytechnology/ngx-miniprofiler';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, NgxMiniprofilerModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: NgxMiniProfilerInterceptor, multi: true },
    {
      provide: NgxMiniProfilerOptions,
      useValue: {
        api: '/api/profiler/',
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
