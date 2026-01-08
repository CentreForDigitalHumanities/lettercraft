import { NgModule } from '@angular/core';
import { ContributorComponent } from './contributor/contributor.component';
import { SharedModule } from '@shared/shared.module';
import { ContributorsListComponent } from './contributors-list/contributors-list.component';



@NgModule({
    declarations: [
        ContributorComponent,
        ContributorsListComponent
    ],
    imports: [
        SharedModule
    ]
})
export class ContributorsModule { }
