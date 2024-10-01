import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { DesignatorsControlComponent } from "./designators-control/designators-control.component";
import { MultiselectComponent } from "./multiselect/multiselect.component";
import { LabelSelectComponent } from "./label-select/label-select.component";
import { EntityDescriptionLeadComponent } from "./entity-description-lead/entity-description-lead.component";
import { DeleteEntityButtonComponent } from "./delete-entity-button/delete-entity-button.component";
import { FormStatusComponent } from './form-status/form-status.component';
import { EpisodeLinkFormComponent } from './episode-link-form/episode-link-form.component';

@NgModule({
    declarations: [
        DesignatorsControlComponent,
        MultiselectComponent,
        LabelSelectComponent,
        EntityDescriptionLeadComponent,
        DeleteEntityButtonComponent,
        FormStatusComponent,
        EpisodeLinkFormComponent,
    ],
    imports: [SharedModule],
    exports: [
        DesignatorsControlComponent,
        MultiselectComponent,
        LabelSelectComponent,
        EntityDescriptionLeadComponent,
        DeleteEntityButtonComponent,
        FormStatusComponent,
        EpisodeLinkFormComponent,
    ],
})
export class DataEntrySharedModule {}
