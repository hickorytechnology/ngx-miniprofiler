export declare global {
  interface Window {
    profiler: IProfiler;
    MiniProfiler: MiniProfiler;
    // eslint-disable-next-line @typescript-eslint/ban-types
    PerformancePaintTiming: Function;
    mPt: MiniProfilerProbeTiming;
    chrome: {
      loadTimes(): {
        firstPaintTime: number;
        firstPaintAfterLoadTime: number;
      }
    };
    // We only check for these existing to hook up xhr events...we need to know noting about them.
    jQuery: any;
    angular: any;
    axios: any;
    xhr: any;
    WebForm_ExecuteCallback(callbackObject: { xmlRequest: XMLHttpRequest }): void;
  }
}
