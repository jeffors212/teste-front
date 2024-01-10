import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from "./pages/pages.module";
import { PagesRoutingModule } from "./pages/pages-routing.module";
import { ToastrModule } from "ngx-toastr";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { SharedModule } from "./shared/shared.module";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    PagesRoutingModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    TooltipModule.forRoot(),
      SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
