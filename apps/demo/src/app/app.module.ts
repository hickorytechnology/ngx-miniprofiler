import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
  MiniProfilerInterceptor,
  MiniProfilerModule,
} from '@hickorytechnology/ngx-miniprofiler';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { NxWelcomeComponent } from './nx-welcome.component';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    HttpClientModule,
    MiniProfilerModule.forRoot({
      api: 'https://localhost:5001/profiler',
      path: 'https://localhost:5001/profiler',
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MiniProfilerInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
