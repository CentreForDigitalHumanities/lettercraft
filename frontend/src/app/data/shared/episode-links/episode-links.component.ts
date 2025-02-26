import { Component, Input } from '@angular/core';
import { dataIcons } from '@shared/icons';
import { SourceMention } from 'generated/graphql';

@Component({
  selector: 'lc-episode-links',
  templateUrl: './episode-links.component.html',
  styleUrls: ['./episode-links.component.scss']
})
export class EpisodeLinksComponent {
    @Input({required: true})
    episodes!: {
        id: string,
        sourceMention: SourceMention,
        designators?: string[] | null,
        note?: string | null,
        episode: {
            id: string,
            name: string,
        }
    }[];

    dataIcons = dataIcons;
}
