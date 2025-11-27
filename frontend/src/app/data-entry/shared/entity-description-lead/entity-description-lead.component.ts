import { Component, Input } from "@angular/core";

interface Entity {
    description?: string;
}

@Component({
    selector: "lc-entity-description-lead",
    templateUrl: "./entity-description-lead.component.html",
    styleUrls: ["./entity-description-lead.component.scss"],
    standalone: false
})
export class EntityDescriptionLeadComponent {
    @Input({ required: true }) entity!: Entity;
}
