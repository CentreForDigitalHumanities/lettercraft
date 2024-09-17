import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "lc-base-modal",
    templateUrl: "./base-modal.component.html",
    styleUrls: ["./base-modal.component.scss"],
})
export class BaseModalComponent {
    @Input() title = "Lettercraft";
    @Output() dismiss = new EventEmitter<void>();

    dismissModal(): void {
        this.dismiss.emit();
    }
}
