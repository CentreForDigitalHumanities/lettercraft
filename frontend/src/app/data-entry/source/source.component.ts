import {
    Component,
    computed,
    TemplateRef,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { actionIcons, dataIcons } from "@shared/icons";
import { DataEntrySourceDetailGQL, EpisodeType } from "generated/graphql";
import { map, shareReplay, switchMap } from "rxjs";

@Component({
    selector: "lc-source",
    templateUrl: "./source.component.html",
    styleUrls: ["./source.component.scss"],
})
export class SourceComponent {
    public breadcrumbs = computed(() => [
        {
            label: "Lettercraft",
            link: "/",
        },
        {
            label: "Data entry",
            link: "/data-entry",
        },
        {
            label: this.sourceTitle(),
            link: "/data-entry/sources/" + this.route.snapshot.params["id"],
        },
    ]);

    public source$ = this.route.params.pipe(
        map((params) => params["id"]),
        switchMap((id) => this.sourceDetailQuery.watch({ id }).valueChanges),
        map((result) => result.data.source),
        shareReplay(1)
    );

    public sourceTitle = toSignal(
        this.source$.pipe(
            map((source) => `${source.medievalAuthor}, ${source.medievalTitle}`)
        ),
        { initialValue: "" }
    );

    public dataIcons = dataIcons;
    public actionIcons = actionIcons;

    public modal: NgbModalRef | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
        private sourceDetailQuery: DataEntrySourceDetailGQL
    ) {}

    public openNewEpisodeModal(newEpisodeModal: TemplateRef<unknown>): void {
        this.modal = this.modalService.open(newEpisodeModal);
        this.modal.result.then((result: { id: string | null; } | null) => {
            if (result && "id" in result) {
                this.router.navigate(["/data-entry/episodes", result.id]);
            }
        });
    }

    public closeModal(): void {
        if (this.modal) {
            this.modal.close();
        }
    }

    public identify(_index: number, item: Pick<EpisodeType, "id">): string {
        return item.id;
    }
}
