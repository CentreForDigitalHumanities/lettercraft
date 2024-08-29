import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { DesignatorsControlComponent } from "./designators-control/designators-control.component";
import { MultiselectComponent } from "./multiselect/multiselect.component";
import { LabelSelectComponent } from "./label-select/label-select.component";
import { FormStatusComponent } from './form-status/form-status.component';

@NgModule({
    declarations: [
        DesignatorsControlComponent,
        MultiselectComponent,
        LabelSelectComponent,
        FormStatusComponent,
    ],
    imports: [SharedModule],
    exports: [
        DesignatorsControlComponent,
        MultiselectComponent,
        LabelSelectComponent,
        FormStatusComponent,
    ],
})
export class DataEntrySharedModule {}
