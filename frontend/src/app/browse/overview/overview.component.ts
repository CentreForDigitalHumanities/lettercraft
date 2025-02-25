import { Component } from "@angular/core";

type Tab = "sources" | "episodes";

@Component({
    selector: "lc-overview",
    templateUrl: "./overview.component.html",
    styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent {
    public selectedTab: Tab = "episodes";
}
