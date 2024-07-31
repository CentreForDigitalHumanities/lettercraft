import { Component, computed } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { actionIcons, dataIcons } from "@shared/icons";
import { DataEntrySourceDetailGQL } from "generated/graphql";
import { map, share, switchMap } from "rxjs";

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
            link: "/data-entry/source/1",
        },
    ]);

    public source$ = this.route.params.pipe(
        map((params) => params["id"]),
        switchMap((id) => this.sourceDetailQuery.watch({ id }).valueChanges),
        map((result) => result.data.source),
        share()
    );

    public sourceTitle = toSignal(
        this.source$.pipe(
            map((source) => `${source.medievalAuthor}, ${source.medievalTitle}`)
        ),
        { initialValue: "" }
    );

    public dataIcons = dataIcons;
    public actionIcons = actionIcons;

    onDelete(): void {
        console.log("Hey there!");
    }

    constructor(
        private route: ActivatedRoute,
        private sourceDetailQuery: DataEntrySourceDetailGQL
    ) {}
}
