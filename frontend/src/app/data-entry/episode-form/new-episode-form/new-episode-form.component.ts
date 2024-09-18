import {
    Component,
    DestroyRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastService } from "@services/toast.service";
import {
    CreateEpisodeInput,
    DataEntryCreateEpisodeGQL,
} from "generated/graphql";

type NewEpisodeForm = {
    [key in keyof CreateEpisodeInput]: FormControl<CreateEpisodeInput[key]>;
};

@Component({
    selector: "lc-new-episode-form",
    templateUrl: "./new-episode-form.component.html",
    styleUrls: ["./new-episode-form.component.scss"],
})
export class NewEpisodeFormComponent implements OnInit {
    @Input({ required: true }) sourceId: string | null = null;
    @Output() mutationStarted = new EventEmitter<void>();
    @Output() episodeCreated = new EventEmitter<string | null>();

    public form = new FormGroup<NewEpisodeForm>({
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

    public submit(): void {
        this.form.updateValueAndValidity();
        this.form.controls.name.markAsTouched();
        if (this.form.invalid) {
            return;
        }
        this.mutationStarted.emit();
        const episodeData = this.form.getRawValue();
        this.updateEpisode
            .mutate(
                { episodeData },
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
                this.episodeCreated.emit(
                    result.data?.createEpisode?.episode?.id ?? null
                );
            });
    }
}
