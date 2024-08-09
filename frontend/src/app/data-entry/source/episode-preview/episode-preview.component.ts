import { Component, Input } from "@angular/core";
import { dataIcons } from "@shared/icons";
import { DataEntrySourceDetailQuery } from "generated/graphql";

type QueriedEpisode = NonNullable<DataEntrySourceDetailQuery["source"]["episodes"]>[0];

@Component({
    selector: "lc-episode-preview",
    templateUrl: "./episode-preview.component.html",
    styleUrls: ["./episode-preview.component.scss"],
})
export class EpisodePreviewComponent {
    @Input({ required: true })
    public episode!: QueriedEpisode;
    public dataIcons = dataIcons;

    public deleteEpisode(episodeId: string): void {
        console.log("Deleting episode with id", episodeId);
    }

    public agentIcon(agent: QueriedEpisode["agents"][0]): string {
        if (agent.isGroup) {
            return dataIcons.group;
        }
        if (agent.describes?.some(person => person?.identifiable)) {
            return dataIcons.person;
        }
        return dataIcons.personUnknown;
    }
}
