import { Component } from "@angular/core";
import { BrowseEpisodeListGQL, EpisodeType } from "generated/graphql";
import { map, share, startWith } from "rxjs";

@Component({
    selector: "lc-browse-episodes",
    templateUrl: "./episodes.component.html",
    styleUrls: ["./episodes.component.scss"],
})
export class EpisodesComponent {
    private queryResult$ = this.episodeListQuery
        .watch()
        .valueChanges.pipe(share());

    public episodes$ = this.queryResult$.pipe(
        map((result) => result.data.episodes)
    );

    public loading$ = this.queryResult$.pipe(
        map((result) => result.loading),
        startWith(true)
    );

    constructor(private episodeListQuery: BrowseEpisodeListGQL) {}

    public identify(_index: number, item: Pick<EpisodeType, "id">): string {
        return item.id;
    }
}
