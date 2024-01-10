import { NgModule } from '@angular/core';
import { HubNgBreadcrumbMenuComponent } from './hub-ng-breadcrumb-menu.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HubNgBreadcrumbMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HubNgBreadcrumbMenuComponent
  ]
})
export class HubNgBreadcrumbMenuModule { }
