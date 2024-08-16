import { Component, DestroyRef, inject, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "@services/toast.service";
import { DataEntryCreateEpisodeGQL } from "generated/graphql";

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

    constructor(
        private destroyRef: DestroyRef,
        private toastService: ToastService,
        private updateEpisode: DataEntryCreateEpisodeGQL
    ) {}

    ngOnInit(): void {
        if (this.sourceId) {
            this.form.controls.source.setValue(this.sourceId);
        }
    }

    public submit(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        if (this.form.invalid) {
            return;
        }
        const input = this.form.getRawValue();
        this.updateEpisode
            .mutate({ input },
                {
                    update: (cache) =>
                        cache.evict({
                            fieldName: "source",
                        }),
                }
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                const errors = result.data?.createEpisode?.errors;
                if (errors && errors.length > 0) {
                    this.toastService.show({
                        body: errors.map((error) => error.messages).join("\n"),
                        type: "danger",
                        header: "Update failed",
                    });
                    return;
                }
                this.toastService.show({
                    body: "Episode created",
                    type: "success",
                    header: "Success",
                });
                this.activeModal.close({
                    id: result.data?.createEpisode?.episode?.id ?? null,
                });
            });
    }
}
