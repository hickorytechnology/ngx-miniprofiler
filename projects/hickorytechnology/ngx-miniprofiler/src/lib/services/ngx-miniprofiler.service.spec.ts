import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { NgxMiniProfilerService } from './ngx-miniprofiler.service';

describe('NgxMiniProfilerService', () => {
  let spectator: SpectatorService<NgxMiniProfilerService>;
  const createService = createServiceFactory(NgxMiniProfilerService);

  beforeEach(() => (spectator = createService()));

  it('should...', () => {
    expect(spectator.service).toBeTruthy();
  });
});
