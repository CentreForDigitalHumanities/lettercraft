import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PrinciplesComponent } from './principles.component';



@NgModule({
    declarations: [
        PrinciplesComponent,
    ],
    imports: [
        SharedModule,
    ]
})
export class PrinciplesModule { }
