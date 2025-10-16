import { NgModule } from '@angular/core';
import { ContributorComponent } from './contributor/contributor.component';
import { SharedModule } from '@shared/shared.module';



@NgModule({
    declarations: [
        ContributorComponent
    ],
    imports: [
        SharedModule
    ]
})
export class ContributorsModule { }
