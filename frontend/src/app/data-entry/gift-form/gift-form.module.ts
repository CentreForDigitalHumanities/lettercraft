import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { GiftFormComponent } from './gift-form.component';



@NgModule({
    declarations: [
        GiftFormComponent,
    ],
    imports: [
        SharedModule
    ],
    exports: [
        GiftFormComponent,
    ]
})
export class GiftFormModule { }
