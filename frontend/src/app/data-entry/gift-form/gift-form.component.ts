import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { actionIcons, dataIcons } from "@shared/icons";
import { DataEntryGiftFormGQL } from "generated/graphql";
import { filter, map, share, switchMap } from "rxjs";

@Component({
    selector: "lc-gift-form",
    templateUrl: "./gift-form.component.html",
    styleUrls: ["./gift-form.component.scss"],
})
export class GiftFormComponent {
    private id$ = this.route.params.pipe(map((params) => params["id"]));

    public gift$ = this.id$.pipe(
        switchMap((id) => this.giftQuery.watch({ id }).valueChanges),
        map((result) => result.data.giftDescription),
        share()
    );

    public breadcrumbs$ = this.gift$.pipe(
        filter((gift) => !!gift),
        map((gift) => {
            if (!gift) {
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
                    label: gift.source.name,
                    link: `/data-entry/sources/${gift.source.id}`,
                },
                {
                    label: gift.name,
                    link: `/data-entry/gifts/${gift.id}`,
                },
            ];
        })
    );

    public dataIcons = dataIcons;
    public actionIcons = actionIcons;

    constructor(
        private route: ActivatedRoute,
        private giftQuery: DataEntryGiftFormGQL
    ) {}
}
