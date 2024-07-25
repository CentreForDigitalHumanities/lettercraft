import { Component } from "@angular/core";
import { Breadcrumb } from "@shared/breadcrumb/breadcrumb.component";
import { DataEntrySourceListGQL, SourceType } from "generated/graphql";
import { map } from "rxjs";

@Component({
    selector: "lc-sources",
    templateUrl: "./sources.component.html",
    styleUrls: ["./sources.component.scss"],
})
export class SourcesComponent {
    public breadcrumbs: Breadcrumb[] = [
        { label: "Lettercraft", link: "/" },
        { label: "Data entry", link: "/data-entry" },
    ];

    public sources$ = this.sourceListQuery
        .watch()
        .valueChanges.pipe(
            map((result) =>
                result.data.sources.filter(
                    (source) => source.name !== "MISSING SOURCE"
                )
            )
        );

    public identify(_index: number, item: Pick<SourceType, "id">): string {
        return item.id;
    }

    constructor(private sourceListQuery: DataEntrySourceListGQL) {}
}
