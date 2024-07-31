import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { SourcesComponent } from "./sources/sources.component";

@NgModule({
    declarations: [SourcesComponent],
    imports: [SharedModule],
    exports: [SourcesComponent],
})
export class DataEntryModule {}
