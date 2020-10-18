import { ClientTiming, ITimingInfo } from './timing';

export class ResultRequest {
  public Id: string;
  public Performance?: ClientTiming[];
  public Probes?: ClientTiming[];
  public RedirectCount?: number;

  constructor(id: string, perfTimings: ITimingInfo[]) {
    this.Id = id;

    if (perfTimings && window.performance && window.performance.timing) {
      const resource = window.performance.timing;
      const start = resource.fetchStart;

      this.Performance = perfTimings
        .filter((current) => resource[current.name])
        .map((current, i) => ({ item: current, index: i }))
        .sort((a, b) => resource[a.item.name] - resource[b.item.name] || a.index - b.index)
        .map((x, i, sorted) => {
          const current = x.item;
          const next = i + 1 < sorted.length ? sorted[i + 1].item : null;

          return {
            ...current,
            ...{
              startTime: resource[current.name] - start,
              timeTaken: !next ? 0 : resource[next.name] - resource[current.name],
            },
          };
        })
        .map((item, i) => ({
          Name: item.name,
          Start: item.startTime,
          Duration: item.point ? undefined : item.timeTaken,
        }));

      if (window.performance.navigation) {
        this.RedirectCount = window.performance.navigation.redirectCount;
      }

      // if (window.mPt) {
      //   const pResults = window.mPt.results();
      //   this.Probes = Object.keys(pResults)
      //     .map((k) =>
      //       pResults[k].start && pResults[k].end
      //         ? {
      //             Name: k,
      //             Start: pResults[k].start - start,
      //             Duration: pResults[k].end - pResults[k].start,
      //           }
      //         : null
      //     )
      //     .filter((v) => v);
      //   window.mPt.flush();
      // }

      // if (window.performance.getEntriesByType && window.PerformancePaintTiming) {
      //   const entries = window.performance.getEntriesByType('paint');
      //   let firstPaint;
      //   let firstContentPaint;

      //   for (const entry of entries) {
      //     switch (entry.name) {
      //       case 'first-paint':
      //         firstPaint = new ClientTiming('firstPaintTime', Math.round(entry.startTime));
      //         this.Performance.push(firstPaint);
      //         break;
      //       case 'first-contentful-paint':
      //         firstContentPaint = new ClientTiming('firstContentfulPaintTime', Math.round(entry.startTime));
      //         break;
      //     }
      //   }
      //   if (firstPaint && firstContentPaint && firstContentPaint.Start > firstPaint.Start) {
      //     this.Performance.push(firstContentPaint);
      //   }
      // } else if (window.chrome && window.chrome.loadTimes) {
      //   // fallback to Chrome timings
      //   const chromeTimes = window.chrome.loadTimes();
      //   if (chromeTimes.firstPaintTime) {
      //     this.Performance.push(
      //       new ClientTiming('firstPaintTime', Math.round(chromeTimes.firstPaintTime * 1000 - start))
      //     );
      //   }
      //   if (chromeTimes.firstPaintAfterLoadTime && chromeTimes.firstPaintAfterLoadTime > chromeTimes.firstPaintTime) {
      //     this.Performance.push(
      //       new ClientTiming('firstPaintAfterLoadTime', Math.round(chromeTimes.firstPaintAfterLoadTime * 1000 - start))
      //     );
      //   }
      // }
    }
  }
}
