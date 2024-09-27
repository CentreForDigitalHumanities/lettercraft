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

    private status$ = formStatusSubject();

    constructor(
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private toastService: ToastService,
        private episodeQuery: DataEntryEpisodeSourceTextMentionGQL,
        private updateEpisode: DataEntryUpdateEpisodeGQL,
        private formService: FormService,
    ) {
        this.formService.attachForm('source-text', this.status$);
    }

    ngOnInit(): void {
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
                switchMap(() => this.form.valueChanges),
                map(() => this.form.getRawValue()),
                filter(() => this.form.valid),
                debounceTime(300),
                withLatestFrom(this.id$),
                tap(() => this.status$.next('loading')),
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
            .subscribe(this.handleResult.bind(this));
    }

    ngOnDestroy(): void {
        this.formService.detachForm('source-text');
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
