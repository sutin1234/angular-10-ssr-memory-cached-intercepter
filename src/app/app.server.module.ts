import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { ServerStateInterceptorService } from './intercepters/serverstate.interceptor';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule
  ],
  providers: [ServerStateInterceptorService],
  bootstrap: [AppComponent],
})
export class AppServerModule { }
