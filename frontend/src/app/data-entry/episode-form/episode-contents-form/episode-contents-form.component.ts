import { Component, DestroyRef, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastService } from "@services/toast.service";
import {
    DataEntryEpisodeContentsGQL,
    DataEntryUpdateEpisodeGQL,
} from "generated/graphql";
import {
    debounceTime,
    filter,
    map,
    Observable,
    switchMap,
    withLatestFrom,
} from "rxjs";

@Component({
    selector: "lc-episode-contents-form",
    templateUrl: "./episode-contents-form.component.html",
    styleUrls: ["./episode-contents-form.component.scss"],
})
export class EpisodeContentsFormComponent implements OnInit {
    private id$: Observable<string> = this.route.params.pipe(
        map((params) => params["id"])
    );

    private episode$ = this.id$.pipe(
        switchMap((id) => this.episodeQuery.watch({ id }).valueChanges),
        map((result) => result.data.episode)
    );

    public form = new FormGroup({
        summary: new FormControl<string>("", {
            nonNullable: true,
        }),
        categories: new FormControl<string[]>([], {
            nonNullable: true,
        }),
    });

    constructor(
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private toastService: ToastService,
        private episodeQuery: DataEntryEpisodeContentsGQL,
        private updateEpisode: DataEntryUpdateEpisodeGQL
    ) {}

    ngOnInit(): void {
        this.episode$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((episode) => {
                if (!episode) {
                    return;
                }
                this.form.patchValue({
                    summary: episode.summary,
                    categories: episode.categories.map((c) => c.id),
                });
            });

        this.form.valueChanges
            .pipe(
                map(() => this.form.getRawValue()),
                filter(() => this.form.valid),
                debounceTime(300),
                withLatestFrom(this.id$),
                switchMap(([episode, id]) =>
                    this.updateEpisode.mutate({
                        input: {
                            id,
                            ...episode,
                        },
                    })
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
}
