import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AddAthleteModalComponent } from './add-athlete-modal/add-athlete-modal.component';
import { ListaAtletasComponent } from './lista-atletas/lista-atletas.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        data: { breadcrumb: 'competition' },
        component: DashboardComponent,
      },
      {
        path: 'athlete',
        data: { breadcrumb: 'Add athlete' },
        component: AddAthleteModalComponent,
      },
      {
        path: 'athleteList',
        data: { breadcrumb: ' athlete List' },
        component: ListaAtletasComponent,
      }
    ],

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
