import { NgModule } from '@angular/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { LayoutModule } from './layout/layout.module';
import { AddAthleteModalComponent } from './add-athlete-modal/add-athlete-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ListaAtletasComponent } from './lista-atletas/lista-atletas.component';

@NgModule({
  imports: [
    LayoutModule,
    ReactiveFormsModule,
    FormsModule,
    AccordionModule.forRoot(),

  ],
  declarations: [
    AddAthleteModalComponent,
    ListaAtletasComponent,

  ],
})
export class PagesModule {}
