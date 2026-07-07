import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { GlossaryComponent } from './glossary.component';



@NgModule({
    declarations: [
        GlossaryComponent,
    ],
    imports: [
        SharedModule,
    ]
})
export class GlossaryModule { }
