import { Component, DestroyRef, OnDestroy } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, Validators } from "@angular/forms";
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
    tap,
    withLatestFrom,
} from "rxjs";
import { FormService } from "../../shared/form.service";
import { formStatusSubject } from "../../shared/utils";
import { ApolloCache } from "@apollo/client/core";


interface EpisodeIdentification {
    name: string;
}

type EpisodeIdentificationForm = {
    [key in keyof EpisodeIdentification]: FormControl<string>;
};

@Component({
    selector: "lc-episode-identification-form",
    templateUrl: "./episode-identification-form.component.html",
    styleUrls: ["./episode-identification-form.component.scss"],
})
export class EpisodeIdentificationFormComponent implements OnDestroy {
    public id$ = this.formService.id$;

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

    private status$ = formStatusSubject();

    constructor(
        private destroyRef: DestroyRef,
        private toastService: ToastService,
        private episodeQuery: DataEntryEpisodeIdentificationGQL,
        private updateEpisode: DataEntryUpdateEpisodeGQL,
        private formService: FormService,
    ) {
        this.formService.attachForm('identification', this.status$);

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

        this.form.statusChanges.pipe(
            filter(status => status === 'INVALID'),
            takeUntilDestroyed(),
        ).subscribe(() => this.status$.next('invalid'));

        this.episode$
            .pipe(
                switchMap(() => this.form.valueChanges),
                debounceTime(500),
                map(() => this.form.getRawValue()),
                filter(() => this.form.valid),
                tap(() => this.status$.next('loading')),
                withLatestFrom(this.id$),
                switchMap(([episode, id]) =>
                    this.performMutation(episode, id)
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(this.handleResult.bind(this));
    }

    ngOnDestroy(): void {
        this.formService.detachForm('identification');
        this.status$.complete();
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

    private updateCache(cache: ApolloCache<unknown>, id: string): void {
        const identified = cache.identify({
            __typename: "EpisodeType",
            id,
        });
        cache.evict({ id: identified, fieldName: 'name' });
        cache.gc();
    }

    private handleResult(result: MutationResult<DataEntryUpdateEpisodeMutation>): void {
        const errors = result.data?.updateEpisode?.errors;
        if (errors && errors.length > 0) {
            this.status$.next('error');
            this.toastService.show({
                body: errors.map((error) => error.messages).join("\n"),
                type: "danger",
                header: "Update failed",
            });
        } else {
            this.status$.next('saved');
        }
    }
}
