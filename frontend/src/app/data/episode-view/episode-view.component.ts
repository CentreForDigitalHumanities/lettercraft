import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { actionIcons, dataIcons } from '@shared/icons';
import { agentIcon, locationIcon } from '@shared/icons-utils';
import { ViewEpisodeGQL, ViewEpisodeQuery } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';
import { entityDescriptionBreadcrumbs } from '../utils/breadcrumbs';

@Component({
  selector: 'lc-episode-view',
  templateUrl: './episode-view.component.html',
  styleUrls: ['./episode-view.component.scss']
})
export class EpisodeViewComponent {
    id$: Observable<string> = this.route.params.pipe(
        map(params => params['id']),
    );
    data$: Observable<ViewEpisodeQuery>;

    dataIcons = dataIcons;
    actionIcons = actionIcons;
    agentIcon = agentIcon;
    locationIcon = locationIcon;

    constructor(
        private route: ActivatedRoute,
        private query: ViewEpisodeGQL,
    ) {
        this.data$ = this.id$.pipe(
            switchMap(id => this.query.watch({ id }).valueChanges),
            map(result => result.data),
        );
    }

    makeBreadcrumbs(data: ViewEpisodeQuery): Breadcrumb[] {
        if (data.episode) {
            return entityDescriptionBreadcrumbs(data.episode);
        } else {
            return [
                { link: '/', label: 'Lettercraft' },
                { link: '/data', label: 'Data' },
                { link: '.', label: 'Not found' }

            ];
        }
    }

    episodeObjects(episode: ViewEpisodeQuery['episode']): any[] {
        if (episode) {
            return [...episode.letters, ...episode.gifts];
        } else {
            return [];
        }

    }
}
