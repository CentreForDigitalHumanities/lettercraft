import { Component, Input } from "@angular/core";
import { statusIcons } from "../icons";

@Component({
    selector: "lc-not-found",
    templateUrl: "./not-found.component.html",
    styleUrls: ["./not-found.component.scss"],
})
export class NotFoundComponent {
    @Input() entity = "entity";
    @Input() id: string | null = "unknown";

    statusIcons = statusIcons;
}
