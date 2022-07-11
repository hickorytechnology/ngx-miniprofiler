import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniProfilerComponent } from './components/miniprofiler/miniprofiler.component';
import { MiniProfilerQueryDialogComponent } from './components/miniprofiler-query-dialog/miniprofiler-query-dialog.component';
import { MiniProfilerResultComponent } from './components/miniprofiler-result/miniprofiler-result.component';
import { MiniProfilerTimingsComponent } from './components/miniprofiler-timings/miniprofiler-timings.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    MiniProfilerComponent,
    MiniProfilerQueryDialogComponent,
    MiniProfilerResultComponent,
    MiniProfilerTimingsComponent,
  ],
  exports: [
    MiniProfilerComponent,
    MiniProfilerQueryDialogComponent,
    MiniProfilerResultComponent,
    MiniProfilerTimingsComponent,
  ],
})
export class MiniProfilerModule { }
