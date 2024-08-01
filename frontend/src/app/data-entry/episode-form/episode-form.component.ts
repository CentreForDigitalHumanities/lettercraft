import { Component } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { actionIcons, dataIcons } from "@shared/icons";
import { DataEntryEpisodeDetailGQL } from "generated/graphql";
import { filter, map, share, switchMap } from "rxjs";

@Component({
    selector: "lc-episode",
    templateUrl: "./episode-form.component.html",
    styleUrls: ["./episode-form.component.scss"],
})
export class EpisodeFormComponent {
    public episode$ = this.route.params.pipe(
        map((params) => params["episodeId"]),
        switchMap((id) => this.episodeQuery.watch({ id }).valueChanges),
        map((result) => result.data.episode),
        share()
    );

    public breadcrumbs$ = this.episode$.pipe(
        filter((episode) => !!episode),
        map((episode) => {
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
                    label: episode.source.medievalTitle,
                    link: `/source/${episode.source.id}`,
                },
                {
                    label: episode.name,
                    link: `/data-entry/episode/${episode.id}`,
                },
            ];
        })
    );

    public dataIcons = dataIcons;
    public actionIcons = actionIcons;

    public labels = [{
        id: 1,
        name: "One"
    }, {
        id: 2,
        name: "Two"
    }];

    public form = this.fb.group({
        identification: this.fb.group({
            name: this.fb.control("", {
                nonNullable: true,
                validators: [Validators.required],
            }),
        }),
        sourceText: this.fb.group({
            designators: this.fb.array([]),
            book: this.fb.control(""),
            chapter: this.fb.control(""),
            page: this.fb.control(""),
        }),
        contents: this.fb.group({
            summary: this.fb.control("")
        })
    });

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private episodeQuery: DataEntryEpisodeDetailGQL
    ) {}

    public addDesignator(): void {
        console.log("Adding designator!");
        const newControl = this.fb.control("");
        this.form.controls.sourceText.controls.designators.push(newControl);
    }

    public removeDesignator(index: number): void {
        this.form.controls.sourceText.controls.designators.removeAt(index);
    }

    public submit(): void {
        console.log("Submitting form!", this.form.getRawValue());

        this.form.updateValueAndValidity();
    }
}
