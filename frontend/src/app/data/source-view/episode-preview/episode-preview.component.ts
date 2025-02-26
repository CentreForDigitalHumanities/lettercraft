import { Component, Input } from '@angular/core';
import { dataIcons } from '@shared/icons';
import { agentIcon, locationIcon } from '@shared/icons-utils';

@Component({
  selector: 'lc-episode-preview',
  templateUrl: './episode-preview.component.html',
  styleUrls: ['./episode-preview.component.scss']
})
export class EpisodePreviewComponent {
    @Input({required: true}) episode!: {
        id: string,
        name: string,
        summary: string,
        book: string,
        chapter: string,
        page: string,
        agents: {
            id: string,
            name: string,
            isGroup: boolean,
            identified: boolean,
        }[],
        spaces: {
            id: string,
            name: string,
            hasIdentifiableFeatures: boolean,
        }[],
        gifts: {
            id: string,
            name: string,
        }[],
        letters: {
            id: string,
            name: string,
        }[],
    };

    dataIcons = dataIcons;
    agentIcon = agentIcon;
    locationIcon = locationIcon;
}
