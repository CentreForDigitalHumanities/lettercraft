import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { actionIcons, dataIcons } from '@shared/icons';
import { agentIcon, locationIcon } from '@shared/icons-utils';
import { ViewEpisodeGQL, ViewEpisodeQuery } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';
import { entityDescriptionBreadcrumbs } from '../utils/breadcrumbs';

type QueriedEpisode = NonNullable<ViewEpisodeQuery["episode"]>;

type EpisodeObject = QueriedEpisode["letters"][number] | QueriedEpisode["gifts"][number];

@Component({
  selector: 'lc-episode-view',
  templateUrl: './episode-view.component.html',
  styleUrls: ['./episode-view.component.scss']
})
export class EpisodeViewComponent {
    id$: Observable<string> = this.route.params.pipe(
        map((params) => params['id'])
    );
    data$ = this.id$.pipe(
        switchMap((id) => this.query.watch({ id }).valueChanges),
        map((result) => result.data)
    );

    dataIcons = dataIcons;
    actionIcons = actionIcons;
    agentIcon = agentIcon;
    locationIcon = locationIcon;

    makeBreadcrumbs = entityDescriptionBreadcrumbs;

    constructor(
        private route: ActivatedRoute,
        private query: ViewEpisodeGQL
    ) {}

    episodeObjects(episode: ViewEpisodeQuery["episode"]): EpisodeObject[] {
        return episode ? [...episode.letters, ...episode.gifts] : [];
    }
}
