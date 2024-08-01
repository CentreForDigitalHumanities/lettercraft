import { Component, Input } from '@angular/core';
import {
    PersonAgentDescriptionGenderGenderChoices as GenderChoices
} from 'generated/graphql';


@Component({
    selector: 'lc-agent-description-form',
    templateUrl: './agent-description-form.component.html',
    styleUrls: ['./agent-description-form.component.scss']
})
export class AgentDescriptionFormComponent {
    @Input() id?: string;

    genderOptions: { value: GenderChoices, label: string }[] = [
        { value: GenderChoices.Female, label: 'Female' },
        { value: GenderChoices.Male, label: 'Male' },
        { value: GenderChoices.Other, label: 'Other' },
        { value: GenderChoices.Mixed, label: 'Mixed (for groups)' },
        { value: GenderChoices.Unknown, label: 'Unknown' }
    ];

}
