import { Component, EventEmitter, Input, Output } from "@angular/core";
import { actionIcons } from "@shared/icons";

export type OrderChange = "up" | "down";

@Component({
    selector: "lc-order-button-group",
    templateUrl: "./order-button-group.component.html",
    styleUrls: ["./order-button-group.component.scss"],
    standalone: false
})
export class OrderButtonGroupComponent {
    @Output() changeOrder = new EventEmitter<OrderChange>();
    @Input() upDisabled = false;
    @Input() downDisabled = false;

    public actionIcons = actionIcons;

    public onUp(): void {
        this.changeOrder.emit("up");
    }

    public onDown(): void {
        this.changeOrder.emit("down");
    }
}
