import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { HubNgSidebarModule } from "../../../../projects/hub-ng-sidebar/src/lib/hub-ng-sidebar.module";
import { HubNgBreadcrumbMenuModule } from "../../../../projects/hub-ng-breadcrumb-menu/src/lib/hub-ng-breadcrumb-menu.module";
import { LayoutService } from './layout.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DashboardModule } from "../dashboard/dashboard.module";
import { RouterOutlet } from "@angular/router";

@NgModule({
  declarations: [
    LayoutComponent
  ],
  providers: [LayoutService],
  imports: [
    CommonModule,
    HubNgSidebarModule,
    HubNgBreadcrumbMenuModule,
    DashboardModule,
    TooltipModule,
    RouterOutlet
  ]
})
export class LayoutModule {}
