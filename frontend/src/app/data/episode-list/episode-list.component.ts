import { Component, DestroyRef, input } from "@angular/core";
import { ViewEpisodesPageGQL } from "generated/graphql";
import { HasID, PageResult } from "../utils/pagination";
import { toObservable } from "@angular/core/rxjs-interop";

@Component({
    selector: "lc-episode-list",
    templateUrl: "./episode-list.component.html",
    styleUrls: ["./episode-list.component.scss"],
    standalone: false
})
export class EpisodeListComponent {
    data = input.required<HasID[]>();

    public pageResult = new PageResult(toObservable(this.data), this.pageQuery, this.destroyRef);

    constructor(
        private pageQuery: ViewEpisodesPageGQL,
        private destroyRef: DestroyRef,
    ) {}
}
