import { Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ApolloCache } from "@apollo/client/core";
import { ToastService } from "@services/toast.service";
import { MutationResult } from "apollo-angular";
import {
    DataEntryEpisodeIdentificationGQL,
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
export class EpisodeIdentificationFormComponent implements OnInit, OnDestroy {
    private id$: Observable<string> = this.route.params.pipe(
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
        description: new FormControl<string>("", {
            nonNullable: true,
        }),
    });

    private formName = "identification";
    private status$ = new BehaviorSubject<FormStatus>("idle");

    constructor(
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private formService: FormService,
        private toastService: ToastService,
        private episodeQuery: DataEntryEpisodeIdentificationGQL,
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
                switchMap(([episode, id]) => this.performMutation(episode, id)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((result) => this.onMutationResult(result));
    }

    ngOnDestroy(): void {
        this.formService.detachForm(this.formName);
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
                update: (cache) => this.updateCache(cache, id),
            }
        );
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

    private updateCache(cache: ApolloCache<unknown>, id: string): void {
        const identified = cache.identify({
            __typename: "EpisodeType",
            id,
        });
        cache.evict({ id: identified });
        cache.gc();
    }
}
