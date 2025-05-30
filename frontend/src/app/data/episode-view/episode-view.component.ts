import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { actionIcons, dataIcons } from '@shared/icons';
import { agentIcon, locationIcon } from '@shared/icons-utils';
import { ViewEpisodeGQL, ViewEpisodeQuery } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';
import { entityDescriptionBreadcrumbs } from '../utils/breadcrumbs';
import { ApiService } from '@services/api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type QueriedEpisode = NonNullable<ViewEpisodeQuery["episode"]>;

type EpisodeObject = QueriedEpisode["letters"][number] | QueriedEpisode["gifts"][number];

@Component({
  selector: 'lc-episode-view',
  templateUrl: './episode-view.component.html',
  styleUrls: ['./episode-view.component.scss']
})
export class EpisodeViewComponent implements OnInit {
    id$: Observable<string> = this.route.params.pipe(
        map((params) => params['id'])
    );
    episode$ = this.id$.pipe(
        switchMap((id) => this.query.watch({ id }).valueChanges),
        map((result) => result.data.episode ?? null)
    );

    dataIcons = dataIcons;
    actionIcons = actionIcons;
    agentIcon = agentIcon;
    locationIcon = locationIcon;

    constructor(
        private destroyRef: DestroyRef,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private query: ViewEpisodeGQL
    ) {}

    ngOnInit(): void {
        this.episode$
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((episode) =>
                this.apiService.rerouteIfEmpty({
                    data: episode,
                    targetRoute: ["/data"],
                    message: "Episode not found",
                })
            );
    }

    makeBreadcrumbs(episode: QueriedEpisode): Breadcrumb[] {
        if (episode) {
            return entityDescriptionBreadcrumbs(episode);
        } else {
            return [
                { link: '/', label: 'Lettercraft' },
                { link: '/data', label: 'Data' },
                { link: '.', label: 'Not found' }
            ];
        }
    }

    episodeObjects(episode: ViewEpisodeQuery["episode"]): EpisodeObject[] {
        return episode ? [...episode.letters, ...episode.gifts] : [];
    }
}
