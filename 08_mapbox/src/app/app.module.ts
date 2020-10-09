import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// Sockets
import { SocketIoModule } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SocketIoModule.forRoot(environment.sokectConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
