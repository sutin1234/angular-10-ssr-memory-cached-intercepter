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
import * as memoryCache from 'memory-cache';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { makeStateKey, TransferState } from '@angular/platform-browser';


@Injectable({
  providedIn: 'root'
})
export class BrowserIntercepterService implements HttpInterceptor {
  constructor(private transferState: TransferState, private ngZone: NgZone) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log('client URL: ' + req.url);

    const cachedData = memoryCache.get(req.url);
    if (cachedData) {
      console.log('client side cachedData ', cachedData);
      return of(new HttpResponse({ body: cachedData, status: 200 }));
    }

    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // memoryCache.put(req.url, event.body, 6000 * 5);
          this.ngZone.runOutsideAngular(() => {
            memoryCache.put(req.url, event.body, 1000 * 60);
          });
          console.log('client side freshData ', event.body);
        }
        return event;
      }));
  }
}
export const BrowserInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: BrowserIntercepterService, multi: true }
];
