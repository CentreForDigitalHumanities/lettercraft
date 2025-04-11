import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Breadcrumb } from "@shared/breadcrumb/breadcrumb.component";
import { actionIcons } from "@shared/icons";
import { ViewSourcesGQL, ViewSourcesQuery } from "generated/graphql";
import {
    map,
    Observable,
    debounceTime,
    distinctUntilChanged,
    merge,
    startWith,
    switchMap,
} from "rxjs";

@Component({
  selector: 'lc-source-list',
  templateUrl: './source-list.component.html',
  styleUrls: ['./source-list.component.scss']
})
export class SourceListComponent {
    breadcrumbs: Breadcrumb[] = [
        { link: '/', label: 'Lettercraft' },
        { link: '/data', label: 'Data' },
        { link: '.', label: 'Sources' },
    ];

    public actionIcons = actionIcons;

    public searchControl = new FormControl<string>("", {
        nonNullable: true,
    });

    private searchInput$ = this.searchControl.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(300)
    );

    public data$: Observable<ViewSourcesQuery> = this.searchInput$.pipe(
        startWith(""),
        switchMap((search) =>
            this.query
                .watch({ search })
                .valueChanges.pipe(map((result) => result.data))
        )
    );

    public loading$ = merge(
        this.searchInput$.pipe(startWith(true)),
        this.data$.pipe(map(() => false))
    );

    constructor(private query: ViewSourcesGQL) {}

    public clearSearch(): void {
        this.searchControl.setValue("");
    }
}
