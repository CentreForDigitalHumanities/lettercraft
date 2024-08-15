import { Component, inject, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import {  } from "generated/graphql";


@Component({
    selector: "lc-new-episode-modal",
    templateUrl: "./new-episode-modal.component.html",
    styleUrls: ["./new-episode-modal.component.scss"],
})
export class NewEpisodeModalComponent implements OnInit {
    @Input({ required: true }) sourceId: string | null = null;

    public activeModal = inject(NgbActiveModal);
    public form = new FormGroup({
        name: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required],
        }),
        source: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });

    constructor(private createEpisode: DataEntryCreateEpisodeGQL) { }

    ngOnInit(): void {
        if (this.sourceId) {
            this.form.controls.source.setValue(this.sourceId);
        }
    }

    public submit(): void {
        this.activeModal.close("create episode");
    }
}
