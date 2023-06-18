// needed to satisfy compiler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export * as NgxMiniProfilerTypes from '../typings';

export {
  PolymorpheusOutletDirective,
  PolymorpheusTemplate,
} from './lib/cdk/polymorpheus';
export { MiniProfilerDialogHostComponent } from './lib/components/dialog-host/dialog-host.component';
export { MiniProfilerDialogComponent } from './lib/components/dialog/dialog.component';
export * from './lib/components/miniprofiler-query-dialog/miniprofiler-query-dialog.component';
export * from './lib/components/miniprofiler-result/miniprofiler-result.component';
export * from './lib/components/miniprofiler-timings/miniprofiler-timings.component';
export * from './lib/components/miniprofiler/miniprofiler.component';
export * from './lib/default-options';
export { MiniProfilerDialogDirective } from './lib/directives/dialog.directive';
export * from './lib/models';
export * from './lib/models/result-request';
export * from './lib/ngx-miniprofiler.module';
export { provideMiniProfilerConfig } from './lib/providers';
export * from './lib/services/miniprofiler-interceptor.interceptor';
export * from './lib/services/miniprofiler.service';
export * from './lib/util/highlight_sql';
