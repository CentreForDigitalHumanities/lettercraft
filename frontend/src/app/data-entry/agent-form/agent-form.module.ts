import { NgModule } from '@angular/core';
import { AgentFormComponent } from './agent-form.component';
import { SharedModule } from '@shared/shared.module';



@NgModule({
    declarations: [
        AgentFormComponent
    ],
    imports: [
        SharedModule,
    ],
    exports: [
        AgentFormComponent,
    ]
})
export class AgentFormModule { }
