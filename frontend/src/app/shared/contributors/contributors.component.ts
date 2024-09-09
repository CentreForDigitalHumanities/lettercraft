import { Component, Input } from "@angular/core";
import { UserType } from "generated/graphql";

@Component({
    selector: "lc-contributors",
    templateUrl: "./contributors.component.html",
    styleUrls: ["./contributors.component.scss"],
})
export class ContributorsComponent {
    @Input({ required: true })
    public contributors: Pick<UserType, "id" | "fullName">[] = [];
}
