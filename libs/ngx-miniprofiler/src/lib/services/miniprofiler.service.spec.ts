import { TestBed } from '@angular/core/testing';

import { MiniProfilerService } from './miniprofiler.service';

describe('MiniProfilerService', () => {
  let service: MiniProfilerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiniProfilerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
