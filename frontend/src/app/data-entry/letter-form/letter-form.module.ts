import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { LetterFormComponent } from './letter-form.component';



@NgModule({
    declarations: [
        LetterFormComponent,
    ],
    imports: [
        SharedModule,
    ],
    exports: [
        LetterFormComponent,
    ]
})
export class LetterFormModule { }
