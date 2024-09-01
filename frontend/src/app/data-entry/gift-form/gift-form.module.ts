import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { GiftFormComponent } from './gift-form.component';
import { GiftIdentificationFormComponent } from './gift-identification-form/gift-identification-form.component';
import { GiftSourceTextFormComponent } from './gift-source-text-form/gift-source-text-form.component';
import { GiftCategoriesFormComponent } from './gift-categories-form/gift-categories-form.component';



@NgModule({
    declarations: [
        GiftFormComponent,
        GiftIdentificationFormComponent,
        GiftSourceTextFormComponent,
        GiftCategoriesFormComponent,
    ],
    imports: [
        SharedModule
    ],
    exports: [
        GiftFormComponent,
    ]
})
export class GiftFormModule { }
