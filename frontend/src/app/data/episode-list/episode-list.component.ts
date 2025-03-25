import { Component } from '@angular/core';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { ViewEpisodesGQL } from 'generated/graphql';
import { map } from 'rxjs';

@Component({
  selector: 'lc-episode-list',
  templateUrl: './episode-list.component.html',
  styleUrls: ['./episode-list.component.scss']
})
export class EpisodeListComponent {
    breadcrumbs: Breadcrumb[] = [
        { link: '/', label: 'Lettercraft' },
        { link: '/data', label: 'Data' },
        { link: '.', label: 'Episodes' },
    ];

    data$ = this.query.watch().valueChanges.pipe(
        map(result => result.data)
    );

    constructor(
        private query: ViewEpisodesGQL,
    ) {}
}
