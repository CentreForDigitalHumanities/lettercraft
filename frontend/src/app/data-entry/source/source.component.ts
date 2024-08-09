import { Component, computed } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { actionIcons, dataIcons } from "@shared/icons";
import { DataEntrySourceDetailGQL } from "generated/graphql";
import { map, shareReplay, switchMap } from "rxjs";

@Component({
    selector: "lc-source",
    templateUrl: "./source.component.html",
    styleUrls: ["./source.component.scss"],
})
export class SourceComponent {
    public breadcrumbs = computed(() => [
        {
            label: "Lettercraft",
            link: "/",
        },
        {
            label: "Data entry",
            link: "/data-entry",
        },
        {
            label: this.sourceTitle(),
            link: "/data-entry/source/" + this.route.snapshot.params["id"],
        },
    ]);

    public source$ = this.route.params.pipe(
        map((params) => params["sourceId"]),
        switchMap((id) => this.sourceDetailQuery.watch({ id }).valueChanges),
        map((result) => result.data.source),
        shareReplay(1)
    );

    public sourceTitle = toSignal(
        this.source$.pipe(
            map((source) => `${source.medievalAuthor}, ${source.medievalTitle}`)
        ),
        { initialValue: "" }
    );

    public dataIcons = dataIcons;
    public actionIcons = actionIcons;

    constructor(
        private route: ActivatedRoute,
        private sourceDetailQuery: DataEntrySourceDetailGQL
    ) {}
}
