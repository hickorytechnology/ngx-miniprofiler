import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { NgxMiniProfilerComponent } from './ngx-miniprofiler.component';

describe('NgxMiniprofilerComponent', () => {
  let spectator: Spectator<NgxMiniProfilerComponent>;
  const createComponent = createComponentFactory(NgxMiniProfilerComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
