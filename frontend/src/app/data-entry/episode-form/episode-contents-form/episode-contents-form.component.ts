import { Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup } from "@angular/forms";
import { ToastService } from "@services/toast.service";
import {
    DataEntryEpisodeCategoriesGQL,
    DataEntryEpisodeContentsGQL,
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
    withLatestFrom
} from "rxjs";
import { LabelSelectOption } from "../../shared/label-select/label-select.component";
import { FormService } from "../../shared/form.service";
import { formStatusSubject } from "../../shared/utils";
import { MutationResult } from "apollo-angular";

@Component({
    selector: "lc-episode-contents-form",
    templateUrl: "./episode-contents-form.component.html",
    styleUrls: ["./episode-contents-form.component.scss"],
})
export class EpisodeContentsFormComponent implements OnInit, OnDestroy {
    private id$: Observable<string> = this.formService.id$;

    private episode$ = this.id$.pipe(
        switchMap((id) => this.episodeQuery.watch({ id }).valueChanges),
        map((result) => result.data.episode),
        shareReplay(1)
    );

    public form = new FormGroup({
        summary: new FormControl<string>("", {
            nonNullable: true,
            updateOn: 'blur',
        }),
        categories: new FormControl<string[]>([], {
            nonNullable: true,
        }),
    });

    public episodeCategories$: Observable<LabelSelectOption[]> =
        this.episodeCategoriesQuery.fetch().pipe(
            map((result) => {
                const categories = result.data.episodeCategories;
                return categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                    description: category.description,
                }));
            })
        );

    private status$ = formStatusSubject();

    constructor(
        private destroyRef: DestroyRef,
        private formService: FormService,
        private toastService: ToastService,
        private episodeQuery: DataEntryEpisodeContentsGQL,
        private episodeCategoriesQuery: DataEntryEpisodeCategoriesGQL,
        private updateEpisode: DataEntryUpdateEpisodeGQL
    ) {
        this.formService.attachForm('contents', this.status$);
    }

    ngOnInit(): void {
        this.episode$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((episode) => {
                if (!episode) {
                    return;
                }
                this.form.patchValue(
                    {
                        summary: episode.summary,
                        categories: episode.categories.map((c) => c.id),
                    },
                    {
                        emitEvent: false,
                        onlySelf: true
                    }
                );
            });

        this.episode$
            .pipe(
                switchMap(() => this.form.valueChanges),
                map(() => this.form.getRawValue()),
                filter(() => this.form.valid),
                debounceTime(300),
                tap(() => this.status$.next('loading')),
                withLatestFrom(this.id$),
                switchMap(this.makeMutation.bind(this))
            )
            .subscribe(this.handleResult.bind(this));
    }

    ngOnDestroy(): void {
        this.formService.detachForm('contents');
        this.status$.complete();
    }

    private makeMutation([episode, id]: [typeof this.form.value, string]) {
        return this.updateEpisode.mutate({
            episodeData: {
                id,
                ...episode,
            },
        }, {
            update: (cache) => {
                const identified = cache.identify({
                    __typename: "EpisodeType",
                    id,
                });
                cache.evict({ id: identified });
                cache.gc();
            },
        });
    }

    private handleResult(result: MutationResult<DataEntryUpdateEpisodeMutation>) {
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
