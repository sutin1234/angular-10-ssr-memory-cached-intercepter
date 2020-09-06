import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Injectable, NgZone } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import * as memoryCache from 'memory-cache';


@Injectable()
export class ServerStateInterceptorService implements HttpInterceptor {

  constructor(private transferState: TransferState, private ngZone: NgZone) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('server URL: ' + req.url);

    const cachedData = memoryCache.get(req.url);
    if (cachedData) {
      console.log('server side cachedData ', cachedData);
      this.transferState.set(makeStateKey(req.url), cachedData);
      return of(new HttpResponse({ body: cachedData, status: 200 }));
    }


    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.transferState.set(makeStateKey(event.url), event.body);
          // memoryCache.put(req.url, event.body, 6000 * 5);
          this.ngZone.runOutsideAngular(() => {
            memoryCache.put(req.url, event.body, 1000 * 60);
          });
          console.log('server side freshData ', event.body);
        }
        return event;
      }));
  }

}
export const ServerInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ServerStateInterceptorService, multi: true }
];
