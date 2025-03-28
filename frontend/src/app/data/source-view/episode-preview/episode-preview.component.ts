import { Component, Input } from '@angular/core';
import { dataIcons } from '@shared/icons';
import { agentIcon, locationIcon } from '@shared/icons-utils';
import { ViewSourceQuery } from 'generated/graphql';

@Component({
  selector: 'lc-episode-preview',
  templateUrl: './episode-preview.component.html',
  styleUrls: ['./episode-preview.component.scss']
})
export class EpisodePreviewComponent {
    @Input({required: true}) episode!: ViewSourceQuery['source']['episodes'][number];

    dataIcons = dataIcons;
    agentIcon = agentIcon;
    locationIcon = locationIcon;
}
