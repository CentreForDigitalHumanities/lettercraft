import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DesignatorsControlComponent } from './designators-control/designators-control.component';



@NgModule({
    declarations: [
        DesignatorsControlComponent
    ],
    imports: [
        SharedModule
    ],
    exports: [
        DesignatorsControlComponent,
    ]
})
export class DataEntrySharedModule { }
