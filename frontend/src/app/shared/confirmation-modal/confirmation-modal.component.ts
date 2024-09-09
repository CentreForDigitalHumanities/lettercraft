import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "lc-confirmation-modal",
    templateUrl: "./confirmation-modal.component.html",
    styleUrls: ["./confirmation-modal.component.scss"],
})
export class ConfirmationModalComponent {
    @Input() public title = "Lettercraft";
    @Input() public message = "Are you sure you want to continue?";

    constructor(private activeModal: NgbActiveModal) {}

    public confirm(): void {
        this.activeModal.close(true);
    }

    public cancel(): void {
        this.activeModal.close(false);
    }

    public dismiss(): void {
        this.activeModal.dismiss();
    }
}
