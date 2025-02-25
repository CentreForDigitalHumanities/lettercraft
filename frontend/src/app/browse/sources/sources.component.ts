import { Component } from "@angular/core";
import { BrowseSourceListGQL, SourceType } from "generated/graphql";
import { map, share, startWith, tap } from "rxjs";

@Component({
    selector: "lc-browse-sources",
    templateUrl: "./sources.component.html",
    styleUrls: ["./sources.component.scss"],
})
export class SourcesComponent {
    // TODO: this query needs filtering for all 'public' sources.
    private queryResult$ = this.sourceListQuery
        .watch()
        .valueChanges.pipe(share());

    public sources$ = this.queryResult$.pipe(
        map((result) =>
            result.data.sources.filter(
                (source) => source.name !== "MISSING SOURCE"
            )
        )
    );

    public loading$ = this.queryResult$.pipe(
        map((result) => result.loading),
        startWith(true)
    );

    constructor(private sourceListQuery: BrowseSourceListGQL) {}

    public identify(_index: number, item: Pick<SourceType, "id">): string {
        return item.id;
    }
}
