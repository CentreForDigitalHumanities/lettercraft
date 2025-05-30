import { Component, DestroyRef, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { ApolloCache } from "@apollo/client/core";
import { ModalService } from "@services/modal.service";
import { ToastService } from "@services/toast.service";
import { actionIcons, dataIcons } from "@shared/icons";
import {
    DataEntryDeleteEpisodeGQL,
    DataEntryDeleteEpisodeMutation,
    DataEntryEpisodeFormGQL,
    DataEntryEpisodeFormQuery,
    Entity,
} from "generated/graphql";
import { filter, map, share, switchMap } from "rxjs";
import { FormService } from "../shared/form.service";
import { MutationResult } from "apollo-angular";
import { ApiService } from "@services/api.service";

type QueriedEpisode = NonNullable<DataEntryEpisodeFormQuery["episode"]>;

@Component({
    selector: "lc-episode",
    templateUrl: "./episode-form.component.html",
    styleUrls: ["./episode-form.component.scss"],
    providers: [FormService],
})
export class EpisodeFormComponent implements OnInit {
    Entity = Entity;

    private id$ = this.formService.id$;

    public episode$ = this.id$.pipe(
        switchMap((id) => this.episodeQuery.watch({ id }).valueChanges),
        map((result) => result.data.episode),
        share()
    );

    public status$ = this.formService.status$;

    public breadcrumbs$ = this.episode$.pipe(
        filter((episode) => !!episode),
        map((episode) => {
            if (!episode) {
                return [];
            }
            return [
                {
                    label: "Lettercraft",
                    link: "/",
                },
                {
                    label: "Data entry",
                    link: "/data-entry",
                },
                {
                    label: episode.source.name,
                    link: `/data-entry/sources/${episode.source.id}`,
                },
                {
                    label: episode.name,
                    link: `/data-entry/episodes/${episode.id}`,
                },
            ];
        })
    );

    public dataIcons = dataIcons;
    public actionIcons = actionIcons;

    public deletingInProgress = false;

    constructor(
        private destroyRef: DestroyRef,
        private apiService: ApiService,
        private formService: FormService,
        private router: Router,
        private toastService: ToastService,
        private modalService: ModalService,
        private episodeQuery: DataEntryEpisodeFormGQL,
        private deleteEpisode: DataEntryDeleteEpisodeGQL
    ) {}

    ngOnInit(): void {
        this.episode$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((episode) => {
                this.apiService.rerouteIfEmpty({
                    data: episode,
                    targetRoute: ["/", "data-entry"],
                    message: "Episode not found",
                });
            });
    }

    public onClickDelete(episode: QueriedEpisode): void {
        this.modalService
            .openConfirmationModal({
                title: "Delete episode",
                message: `Are you sure you want to delete this episode? (${episode.name})`,
            })
            .then(() => this.performDelete(episode.id, episode.source.id))
            .catch(() => {
                // Do nothing on cancel / dismissal.
            });
    }

    private performDelete(episodeId: string, sourceId: string): void {
        this.deletingInProgress = true;
        this.deleteEpisode
            .mutate(
                {
                    id: episodeId,
                },
                {
                    update: (cache) => this.updateCache(cache, episodeId),
                }
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => this.onMutationResult(result, sourceId));
    }

    private onMutationResult(
        result: MutationResult<DataEntryDeleteEpisodeMutation>,
        sourceId: string
    ): void {
        this.deletingInProgress = false;
        const errors = result.data?.deleteEpisode?.errors;
        if (errors && errors.length > 0) {
            this.toastService.show({
                body: errors.map((error) => error.messages).join("\n"),
                type: "danger",
                header: "Deletion failed",
            });
        } else {
            this.toastService.show({
                body: "Episode deleted",
                type: "success",
                header: "Success",
            });
        }
        this.router.navigate([`/data-entry/sources/${sourceId}`]);
    }

    private updateCache(cache: ApolloCache<unknown>, episodeId: string): void {
        const identified = cache.identify({
            __typename: "EpisodeType",
            id: episodeId,
        });
        cache.evict({ id: identified });
        cache.gc();
    }
}
