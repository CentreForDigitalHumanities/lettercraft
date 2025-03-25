import { Component } from '@angular/core';
import { ViewEpisodesGQL } from 'generated/graphql';
import { map } from 'rxjs';

@Component({
  selector: 'lc-episode-list',
  templateUrl: './episode-list.component.html',
  styleUrls: ['./episode-list.component.scss']
})
export class EpisodeListComponent {
    data$ = this.query.watch().valueChanges.pipe(
        map(result => result.data)
    );

    constructor(
        private query: ViewEpisodesGQL,
    ) {}
}
