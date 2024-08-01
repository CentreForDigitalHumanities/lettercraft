import { Component } from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: "lc-episode-source-text-form",
    templateUrl: "./episode-source-text-form.component.html",
    styleUrls: ["./episode-source-text-form.component.scss"],
})
export class EpisodeSourceTextFormComponent {
    public form = new FormGroup({
        designators: new FormArray<FormControl<string>>([]),
        book: new FormControl<string>(""),
        chapter: new FormControl<string>(""),
        page: new FormControl<string>(""),
    });
}
