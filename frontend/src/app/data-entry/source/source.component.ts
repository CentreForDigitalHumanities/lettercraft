import { Component, computed } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { actionIcons, dataIcons } from "@shared/icons";
import { DataEntrySourceDetailGQL, DataEntrySourceDetailQuery } from "generated/graphql";
import { map, share, switchMap } from "rxjs";

type QueriedAgent = NonNullable<DataEntrySourceDetailQuery["source"]["episodes"]>[0]["agents"][0];

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
            link: "/data-entry/source/" + this.route.snapshot.params["id"],
        },
    ]);

    public source$ = this.route.params.pipe(
        map((params) => params["id"]),
        switchMap((id) => this.sourceDetailQuery.watch({ id }).valueChanges),
        map((result) => result.data.source),
        share()
    );

    public sourceTitle = toSignal(
        this.source$.pipe(
            map((source) => `${source.medievalAuthor}, ${source.medievalTitle}`)
        ),
        { initialValue: "" }
    );

    public dataIcons = dataIcons;
    public actionIcons = actionIcons;

    constructor(
        private route: ActivatedRoute,
        private sourceDetailQuery: DataEntrySourceDetailGQL
    ) { }


    public deleteEpisode(episodeId: string): void {
        console.log("Deleting episode with id", episodeId);
    }

    public agentIcon(agent: QueriedAgent): string {
        if (agent.isGroup) {
            return dataIcons.group;
        }
        if (agent.describes?.some(person => person?.identifiable)) {
            return dataIcons.person;
        }
        return dataIcons.personUnknown;
    }
}
