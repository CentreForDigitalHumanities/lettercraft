import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { DesignatorsControlComponent } from "./designators-control/designators-control.component";
import { MultiselectComponent } from "./multiselect/multiselect.component";

@NgModule({
    declarations: [DesignatorsControlComponent, MultiselectComponent],
    imports: [SharedModule],
    exports: [DesignatorsControlComponent, MultiselectComponent],
})
export class DataEntrySharedModule {}
