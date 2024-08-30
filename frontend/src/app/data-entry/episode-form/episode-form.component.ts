import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { actionIcons, dataIcons } from "@shared/icons";
import { DataEntryEpisodeFormGQL } from "generated/graphql";
import { filter, map, share, switchMap } from "rxjs";

@Component({
    selector: "lc-episode",
    templateUrl: "./episode-form.component.html",
    styleUrls: ["./episode-form.component.scss"],
})
export class EpisodeFormComponent {
    private id$ = this.route.params.pipe(map((params) => params["id"]));

    public episode$ = this.id$.pipe(
        switchMap((id) => this.episodeQuery.watch({ id }).valueChanges),
        map((result) => result.data.episode),
        share()
    );

    public breadcrumbs$ = this.episode$.pipe(
        filter((episode) => !!episode),
        map((episode) => {
            if (!episode) {
                return [];
            }
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
                    label: episode.source.name,
                    link: `/data-entry/sources/${episode.source.id}`,
                },
                {
                    label: episode.name,
                    link: `/data-entry/episodes/${episode.id}`,
                },
            ];
        })
    );

    public dataIcons = dataIcons;
    public actionIcons = actionIcons;

    constructor(
        private route: ActivatedRoute,
        private episodeQuery: DataEntryEpisodeFormGQL
    ) {}
}
