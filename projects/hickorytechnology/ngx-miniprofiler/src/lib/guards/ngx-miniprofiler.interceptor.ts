import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NgxMiniprofilerService } from '../services/ngx-miniprofiler.service';

@Injectable()
export class NgxMiniProfilerInterceptor implements HttpInterceptor {
  constructor(private profilerService: NgxMiniprofilerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
              this.profilerService.SetIds(ids);
            }
          });
        }
      })
    );
  }
}
