import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { actionIcons, dataIcons } from "@shared/icons";
import { DataEntryEpisodeDetailGQL } from "generated/graphql";
import { filter, map, share, switchMap } from "rxjs";

@Component({
    selector: "lc-episode",
    templateUrl: "./episode-form.component.html",
    styleUrls: ["./episode-form.component.scss"],
})
export class EpisodeFormComponent {
    public episode$ = this.route.params.pipe(
        map((params) => params["episodeId"]),
        switchMap((id) => this.episodeQuery.watch({ id }).valueChanges),
        map((result) => result.data.episode),
        share()
    );

    public breadcrumbs$ = this.episode$.pipe(
        filter((episode) => !!episode),
        map((episode) => {
            return [
                {
                    label: "Lettercraft",
                    link: "/",
                },
                {
                    label: "Data entry",
                    link: "/data-entry",
                },
                {
                    label: episode.source.medievalTitle,
                    link: `/source/${episode.source.id}`,
                },
                {
                    label: episode.name,
                    link: `/data-entry/episode/${episode.id}`,
                },
            ];
        })
    );

    public dataIcons = dataIcons;
    public actionIcons = actionIcons;

    constructor(
        private route: ActivatedRoute,
        private episodeQuery: DataEntryEpisodeDetailGQL
    ) {}
}
