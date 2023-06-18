import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  PolymorpheusOutletDirective,
  PolymorpheusTemplate,
} from './cdk/polymorpheus';
import { MiniProfilerDialogHostComponent } from './components/dialog-host/dialog-host.component';
import { MiniProfilerDialogComponent } from './components/dialog/dialog.component';
import { MiniProfilerQueryDialogComponent } from './components/miniprofiler-query-dialog/miniprofiler-query-dialog.component';
import { MiniProfilerResultComponent } from './components/miniprofiler-result/miniprofiler-result.component';
import { MiniProfilerTimingsComponent } from './components/miniprofiler-timings/miniprofiler-timings.component';
import { MiniProfilerComponent } from './components/miniprofiler/miniprofiler.component';
import { MiniProfilerDefaultOptions } from './default-options';
import { MiniProfilerDialogDirective } from './directives/dialog.directive';
import { miniprofilerAsDialog, provideMiniProfilerConfig } from './providers';
import { MiniProfilerDialogService } from './services/dialog.service';
import { MiniProfilerInterceptor } from './services/miniprofiler-interceptor.interceptor';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [
    MiniProfilerDialogHostComponent,
    MiniProfilerDialogComponent,
    MiniProfilerDialogDirective,
    MiniProfilerComponent,
    MiniProfilerQueryDialogComponent,
    MiniProfilerResultComponent,
    MiniProfilerTimingsComponent,
    PolymorpheusOutletDirective,
    PolymorpheusTemplate,
  ],
  exports: [
    MiniProfilerDialogHostComponent,
    MiniProfilerDialogComponent,
    MiniProfilerDialogDirective,
    MiniProfilerComponent,
    MiniProfilerQueryDialogComponent,
    MiniProfilerResultComponent,
    MiniProfilerTimingsComponent,
    PolymorpheusOutletDirective,
    PolymorpheusTemplate,
  ],
  providers: [
    MiniProfilerInterceptor,
    miniprofilerAsDialog(MiniProfilerDialogService),
  ],
})
export class MiniProfilerModule {
  static forRoot(
    config: Partial<MiniProfilerDefaultOptions> = {}
  ): ModuleWithProviders<MiniProfilerModule> {
    return {
      ngModule: MiniProfilerModule,
      providers: [provideMiniProfilerConfig(config)],
    };
  }
}
