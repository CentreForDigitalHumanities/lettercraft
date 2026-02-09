import { Component, DestroyRef, input } from "@angular/core";
import { ViewSourcesPageGQL } from "generated/graphql";
import { HasID, PageResult } from "../utils/pagination";
import { toObservable } from "@angular/core/rxjs-interop";


@Component({
    selector: "lc-source-list",
    templateUrl: "./source-list.component.html",
    styleUrls: ["./source-list.component.scss"],
    standalone: false
})
export class SourceListComponent {
    data = input.required<HasID[]>();

    public pageResult = new PageResult(toObservable(this.data), this.pageQuery, this.destroyRef);

    constructor(
        private pageQuery: ViewSourcesPageGQL,
        private destroyRef: DestroyRef,
    ) { }
}
