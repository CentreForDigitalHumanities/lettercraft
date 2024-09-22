import { Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastService } from "@services/toast.service";
import {
    DataEntryEpisodeSourceTextMentionGQL,
    DataEntryUpdateEpisodeGQL,
    DataEntryUpdateEpisodeMutation,
} from "generated/graphql";
import {
    BehaviorSubject,
    debounceTime,
    filter,
    map,
    Observable,
    share,
    shareReplay,
    switchMap,
    withLatestFrom,
} from "rxjs";
import { FormStatus } from "../../shared/types";
import { FormService } from "../../shared/form.service";
import { MutationResult } from "apollo-angular";

@Component({
    selector: "lc-episode-source-text-form",
    templateUrl: "./episode-source-text-form.component.html",
    styleUrls: ["./episode-source-text-form.component.scss"],
})
export class EpisodeSourceTextFormComponent implements OnInit, OnDestroy {
    private id$: Observable<string> = this.route.params.pipe(
        map((params) => params["id"])
    );

    public episode$ = this.id$.pipe(
        switchMap((id) => this.episodeQuery.watch({ id }).valueChanges),
        map((result) => result.data.episode),
        shareReplay(1)
    );

    public form = new FormGroup({
        designators: new FormControl<string[]>([], { nonNullable: true }),
        book: new FormControl<string>("", { nonNullable: true }),
        chapter: new FormControl<string>("", { nonNullable: true }),
        page: new FormControl<string>("", { nonNullable: true }),
    });

    private formName = "sourceMention";
    private status$ = new BehaviorSubject<FormStatus>("idle");

    constructor(
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private formService: FormService,
        private toastService: ToastService,
        private episodeQuery: DataEntryEpisodeSourceTextMentionGQL,
        private updateEpisode: DataEntryUpdateEpisodeGQL
    ) {}

    ngOnInit(): void {
        this.formService.attachForm(this.formName, this.status$);

        this.episode$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((episode) => {
                if (!episode) {
                    return;
                }
                this.form.patchValue(episode, {
                    emitEvent: false,
                    onlySelf: true,
                });
            });

        this.form.statusChanges
            .pipe(
                filter((status) => status == "INVALID"),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => this.status$.next("invalid"));

        const validFormSubmission$ = this.episode$.pipe(
            switchMap(() =>
                this.form.valueChanges.pipe(
                    map(() => this.form.getRawValue()),
                    filter(() => this.form.valid)
                )
            ),
            debounceTime(300),
            share()
        );

        validFormSubmission$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.status$.next("loading"));

        validFormSubmission$
            .pipe(
                withLatestFrom(this.id$),
                switchMap(([episode, id]) =>
                    this.updateEpisode.mutate({
                        episodeData: {
                            id,
                            ...episode,
                        },
                    })
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((result) => this.onMutationResult(result));
    }

    ngOnDestroy(): void {
        this.formService.detachForm(this.formName);
    }

    private onMutationResult(
        result: MutationResult<DataEntryUpdateEpisodeMutation>
    ): void {
        const errors = result.data?.updateEpisode?.errors;
        if (errors && errors.length > 0) {
            this.status$.next("error");
            this.toastService.show({
                body: errors.map((error) => error.messages).join("\n"),
                type: "danger",
                header: "Update failed",
            });
        }
        this.status$.next("saved");
    }
}
