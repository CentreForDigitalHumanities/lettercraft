import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { DesignatorsControlComponent } from "./designators-control/designators-control.component";
import { MultiselectComponent } from "./multiselect/multiselect.component";
import { LabelSelectComponent } from "./label-select/label-select.component";
import { EntityDescriptionLeadComponent } from "./entity-description-lead/entity-description-lead.component";
import { DeleteEntityButtonComponent } from "./delete-entity-button/delete-entity-button.component";
import { FormStatusComponent } from './form-status/form-status.component';
import { FormService } from "./form.service";

@NgModule({
    declarations: [
        DesignatorsControlComponent,
        MultiselectComponent,
        LabelSelectComponent,
        EntityDescriptionLeadComponent,
        DeleteEntityButtonComponent,
        FormStatusComponent,
    ],
    imports: [SharedModule],
    providers: [FormService],
    exports: [
        DesignatorsControlComponent,
        MultiselectComponent,
        LabelSelectComponent,
        EntityDescriptionLeadComponent,
        DeleteEntityButtonComponent,
        FormStatusComponent,
    ],
})
export class DataEntrySharedModule {}
