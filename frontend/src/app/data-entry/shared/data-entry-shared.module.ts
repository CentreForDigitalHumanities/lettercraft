import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { DesignatorsControlComponent } from "./designators-control/designators-control.component";
import { MultiselectComponent } from "./multiselect/multiselect.component";
import { EntityDescriptionLeadComponent } from "./entity-description-lead/entity-description-lead.component";
import { DeleteEntityButtonComponent } from "./delete-entity-button/delete-entity-button.component";
import { FormStatusComponent } from "./form-status/form-status.component";
import { EpisodeLinkFormComponent } from "./episode-link-form/episode-link-form.component";
import { SingleMultiSelectComponent } from "./single-multi-select/single-multi-select.component";
import { LabelSelectComponent } from './label-select/label-select.component';

@NgModule({
    declarations: [
        DesignatorsControlComponent,
        MultiselectComponent,
        EntityDescriptionLeadComponent,
        DeleteEntityButtonComponent,
        FormStatusComponent,
        EpisodeLinkFormComponent,
        SingleMultiSelectComponent,
        LabelSelectComponent,
    ],
    imports: [SharedModule],
    exports: [
        DesignatorsControlComponent,
        MultiselectComponent,
        EntityDescriptionLeadComponent,
        DeleteEntityButtonComponent,
        FormStatusComponent,
        EpisodeLinkFormComponent,
        SingleMultiSelectComponent,
        LabelSelectComponent,
    ],
})
export class DataEntrySharedModule {}
