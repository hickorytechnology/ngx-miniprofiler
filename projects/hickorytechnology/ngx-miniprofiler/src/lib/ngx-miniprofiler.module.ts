import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxMiniProfilerResultComponent } from './components/ngx-miniprofiler-result/ngx-miniprofiler-result.component';
import { NgxMiniProfilerTimingsComponent } from './components/ngx-miniprofiler-timings/ngx-miniprofiler-timings.component';
import { NgxMiniProfilerComponent } from './components/ngx-miniprofiler/ngx-miniprofiler.component';

@NgModule({
  imports: [CommonModule],
  declarations: [NgxMiniProfilerComponent, NgxMiniProfilerResultComponent, NgxMiniProfilerTimingsComponent],
  exports: [NgxMiniProfilerComponent, NgxMiniProfilerResultComponent, NgxMiniProfilerTimingsComponent],
})
export class NgxMiniprofilerModule {}
