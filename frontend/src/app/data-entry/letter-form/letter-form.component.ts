import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Breadcrumb } from "@shared/breadcrumb/breadcrumb.component";
import { actionIcons, dataIcons } from "@shared/icons";
import { DataEntryLetterFormGQL } from "generated/graphql";
import { filter, map, Observable, share, switchMap } from "rxjs";

@Component({
    selector: "lc-letter-form",
    templateUrl: "./letter-form.component.html",
    styleUrls: ["./letter-form.component.scss"],
})
export class LetterFormComponent {
    private id$ = this.route.params.pipe(map((params) => params["id"]));

    public letter$ = this.id$.pipe(
        switchMap((id) => this.letterQuery.watch({ id }).valueChanges),
        map((result) => result.data.letterDescription),
        share()
    );

    public breadcrumbs$ = this.letter$.pipe(
        filter((letter) => !!letter),
        map((letter) => {
            if (!letter) {
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
                    label: letter.source.name,
                    link: `/data-entry/sources/${letter.source.id}`,
                },
                {
                    label: letter.name,
                    link: `/data-entry/letters/${letter.id}`,
                },
            ];
        })
    );

    public dataIcons = dataIcons;
    public actionIcons = actionIcons;

    constructor(
        private route: ActivatedRoute,
        private letterQuery: DataEntryLetterFormGQL
    ) {}
}
