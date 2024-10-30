import { Component, EventEmitter, Input, Output } from "@angular/core";
import { actionIcons } from "@shared/icons";

export type OrderChange = "up" | "down";

@Component({
    selector: "lc-order-button-group",
    templateUrl: "./order-button-group.component.html",
    styleUrls: ["./order-button-group.component.scss"],
})
export class OrderButtonGroupComponent {
    @Input() entityName: string | null = null;
    @Output() changeOrder = new EventEmitter<OrderChange>();

    public actionIcons = actionIcons;

    public onUp(): void {
        this.changeOrder.emit("up");
    }

    public onDown(): void {
        this.changeOrder.emit("down");
    }
}
