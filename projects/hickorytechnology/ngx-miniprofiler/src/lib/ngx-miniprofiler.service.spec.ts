import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { NgxMiniprofilerService } from './ngx-miniprofiler.service';

describe('NgxMiniprofilerService', () => {
  let spectator: SpectatorService<NgxMiniprofilerService>;
  const createService = createServiceFactory(NgxMiniprofilerService);

  beforeEach(() => spectator = createService());

  it('should...', () => {
    expect(spectator.service).toBeTruthy();
  });
});