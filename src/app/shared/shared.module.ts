import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Timer } from "./services/timer.service";


@NgModule({
    declarations: [
    ],
    providers:[
        Timer
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: []
})
export class SharedModule {
}
