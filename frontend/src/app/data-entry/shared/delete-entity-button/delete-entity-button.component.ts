import { Component, EventEmitter, Input, Output } from "@angular/core";
import { actionIcons } from "@shared/icons";

@Component({
    selector: "lc-delete-entity-button",
    templateUrl: "./delete-entity-button.component.html",
    styleUrls: ["./delete-entity-button.component.scss"],
})
export class DeleteEntityButtonComponent {
    @Input({ required: true }) public entityName!: string;
    @Input() public deletingInProgress = false;
    @Output() public clickDelete = new EventEmitter<void>();

    public actionIcons = actionIcons;
}
