import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { DialogModule } from '@ngneat/dialog';
import { NgxMiniProfilerQueryDialogComponent } from './components/ngx-miniprofiler-query-dialog/ngx-miniprofiler-query-dialog.component';
import { NgxMiniProfilerResultComponent } from './components/ngx-miniprofiler-result/ngx-miniprofiler-result.component';
import { NgxMiniProfilerTimingsComponent } from './components/ngx-miniprofiler-timings/ngx-miniprofiler-timings.component';
import { NgxMiniProfilerComponent } from './components/ngx-miniprofiler/ngx-miniprofiler.component';
import { NgxMiniProfilerInterceptor } from './guards/ngx-miniprofiler.interceptor';

export const DialogModuleForRoot = DialogModule.forRoot();
@NgModule({
  imports: [CommonModule, HttpClientModule, DialogModuleForRoot],
  declarations: [
    NgxMiniProfilerComponent,
    NgxMiniProfilerResultComponent,
    NgxMiniProfilerTimingsComponent,
    NgxMiniProfilerQueryDialogComponent,
  ],
  exports: [
    NgxMiniProfilerComponent,
    NgxMiniProfilerResultComponent,
    NgxMiniProfilerTimingsComponent,
    NgxMiniProfilerQueryDialogComponent,
  ],
  providers: [NgxMiniProfilerInterceptor],
})
export class NgxMiniProfilerModule {}
