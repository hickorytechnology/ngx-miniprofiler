import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { NgxMiniprofilerComponent } from './ngx-miniprofiler.component';

describe('NgxMiniprofilerComponent', () => {
  let spectator: Spectator<NgxMiniprofilerComponent>;
  const createComponent = createComponentFactory(NgxMiniprofilerComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
