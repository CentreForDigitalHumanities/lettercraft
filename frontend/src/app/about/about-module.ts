import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PrinciplesComponent } from './principles/principles.component';
import { OutputComponent } from './output/output.component';



@NgModule({
    declarations: [
        PrinciplesComponent,
        OutputComponent,
    ],
    imports: [
        SharedModule,
    ]
})
export class AboutModule { }
