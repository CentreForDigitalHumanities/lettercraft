import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { actionIcons } from "@shared/icons";

@Component({
    selector: "lc-action-button-group",
    templateUrl: "./action-button-group.component.html",
    styleUrls: ["./action-button-group.component.scss"],
})
export class ActionButtonGroupComponent {
    @Input({ required: true }) public editLink!: RouterLink["routerLink"];
    @Output() deleteAction = new EventEmitter<void>();

    public actionIcons = actionIcons;

    public onDelete(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.deleteAction.emit();
    }
}
