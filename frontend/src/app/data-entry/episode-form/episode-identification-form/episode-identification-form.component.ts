import { Component, DestroyRef, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastService } from "@services/toast.service";
import { MutationResult } from "apollo-angular";
import {
    DataEntryEpisodeIdentificationGQL,
    DataEntryUpdateEpisodeGQL,
    DataEntryUpdateEpisodeMutation,
} from "generated/graphql";
import {
    debounceTime,
    filter,
    map,
    Observable,
    shareReplay,
    switchMap,
    withLatestFrom,
} from "rxjs";

interface EpisodeIdentification {
    name: string;
    description: string;
}

type EpisodeIdentificationForm = {
    [key in keyof EpisodeIdentification]: FormControl<string>;
};

@Component({
    selector: "lc-episode-identification-form",
    templateUrl: "./episode-identification-form.component.html",
    styleUrls: ["./episode-identification-form.component.scss"],
})
export class EpisodeIdentificationFormComponent implements OnInit {
    public id$: Observable<string> = this.route.params.pipe(
        map((params) => params["id"])
    );

    public episode$ = this.id$.pipe(
        switchMap((id) => this.episodeQuery.watch({ id }).valueChanges),
        map((result) => result.data.episode),
        shareReplay(1)
    );

    public form = new FormGroup<EpisodeIdentificationForm>({
        name: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });

    constructor(
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private toastService: ToastService,
        private episodeQuery: DataEntryEpisodeIdentificationGQL,
        private updateEpisode: DataEntryUpdateEpisodeGQL
    ) {}

    public ngOnInit(): void {
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

        this.episode$
            .pipe(
                switchMap(() =>
                    this.form.valueChanges.pipe(
                        map(() => this.form.getRawValue()),
                        filter(() => this.form.valid),
                        debounceTime(300),
                        withLatestFrom(this.id$),
                        switchMap(([episode, id]) =>
                            this.performMutation(episode, id)
                        ),
                        takeUntilDestroyed(this.destroyRef)
                    )
                )
            )
            .subscribe((result) => {
                const errors = result.data?.updateEpisode?.errors;
                if (errors && errors.length > 0) {
                    this.toastService.show({
                        body: errors.map((error) => error.messages).join("\n"),
                        type: "danger",
                        header: "Update failed",
                    });
                }
            });
    }

    private performMutation(
        episode: EpisodeIdentification,
        id: string
    ): Observable<MutationResult<DataEntryUpdateEpisodeMutation>> {
        return this.updateEpisode.mutate(
            {
                episodeData: {
                    ...episode,
                    id,
                },
            },
            {
                update: cache => this.updateCache(cache, id),
            }
        );
    }

    private updateCache(cache: any, id: string): void {
        const identified = cache.identify({
            __typename: "EpisodeType",
            id,
        });
        cache.evict({ id: identified });
        cache.gc();
    }
}
