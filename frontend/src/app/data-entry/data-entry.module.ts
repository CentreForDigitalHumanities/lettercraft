import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { SourcesComponent } from "./sources/sources.component";
import { SourceComponent } from './source/source.component';

@NgModule({
    declarations: [SourcesComponent, SourceComponent],
    imports: [SharedModule],
    exports: [SourcesComponent, SourceComponent],
})
export class DataEntryModule {}
