import { Component } from "@angular/core";
import { Breadcrumb } from "@shared/breadcrumb/breadcrumb.component";
import { DataEntrySourceListGQL } from "generated/graphql";
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

    constructor(private sourceListQuery: DataEntrySourceListGQL) {}
}
