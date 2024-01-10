import {NgModule} from '@angular/core';
import {HubNgSidebarComponent} from './hub-ng-sidebar.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TooltipModule} from "ngx-bootstrap/tooltip";


@NgModule({
  declarations: [
    HubNgSidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TooltipModule
  ],
  exports: [
    HubNgSidebarComponent
  ]
})
export class HubNgSidebarModule {
}
