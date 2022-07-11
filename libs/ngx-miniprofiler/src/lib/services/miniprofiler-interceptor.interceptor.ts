import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { MiniProfilerService } from './miniprofiler.service';

@Injectable()
export class MiniProfilerInterceptor implements HttpInterceptor {

  constructor(private profilerService: MiniProfilerService) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.has('skip')) {
      const request = req.clone({
        headers: req.headers.delete('skip'),
      });
      return next.handle(request);
    }

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          const headers = event.headers.getAll('X-MiniProfiler-Ids');
          if (!headers) {
            return;
          }

          headers.forEach((miniprofilerIdHeader) => {
            const ids = JSON.parse(miniprofilerIdHeader) as string[];
            if (ids.length > 0) {
              this.profilerService.setIds(ids);
            }
          });
        }
      })
    );
  }
}
