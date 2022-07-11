import { TestBed } from '@angular/core/testing';

import { MiniProfilerInterceptor } from './miniprofiler-interceptor.interceptor';

describe('MiniprofilerInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MiniProfilerInterceptor
    ]
  }));

  it('should be created', () => {
    const interceptor: MiniProfilerInterceptor = TestBed.inject(MiniProfilerInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
