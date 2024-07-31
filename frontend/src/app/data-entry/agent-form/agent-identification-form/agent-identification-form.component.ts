import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'lc-agent-identification-form',
    templateUrl: './agent-identification-form.component.html',
    styleUrls: ['./agent-identification-form.component.scss']
})
export class AgentIdentificationFormComponent {
    form = new FormGroup({
        name: new FormControl<string>(''),
        description: new FormControl<string>(''),
        isGroup: new FormControl<boolean>(false),
    });
}
