import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: "lc-episode-contents-form",
    templateUrl: "./episode-contents-form.component.html",
    styleUrls: ["./episode-contents-form.component.scss"],
})
export class EpisodeContentsFormComponent {
    public form = new FormGroup({
        summary: new FormControl<string>(""),
        labels: new FormControl<string[]>([]),
    });
}
