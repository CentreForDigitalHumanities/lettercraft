import { Component } from '@angular/core';
import { episodes } from './source-data';
import { agentIcon, icons } from '@shared/icons';

/** alternative workflow implementation */
@Component({
    selector: 'lc-source-alt',
    templateUrl: './source-alt.component.html',
    styleUrls: ['./source-alt.component.scss']
})
export class SourceAltComponent {

    icons = icons;
    episodes = episodes;
    agentIcon = agentIcon;

}
