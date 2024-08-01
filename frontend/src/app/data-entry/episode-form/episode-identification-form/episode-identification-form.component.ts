import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "lc-episode-identification-form",
    templateUrl: "./episode-identification-form.component.html",
    styleUrls: ["./episode-identification-form.component.scss"],
})
export class EpisodeIdentificationFormComponent {
    public form = new FormGroup({
        name: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });
}
