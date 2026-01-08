import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "lc-confirmation-modal",
    templateUrl: "./confirmation-modal.component.html",
    styleUrls: ["./confirmation-modal.component.scss"],
    standalone: false
})
export class ConfirmationModalComponent {
    @Input({ required: true }) public title = "";
    @Input() public message = "Are you sure you want to continue?";

    constructor(private activeModal: NgbActiveModal) {}

    public confirm(): void {
        this.activeModal.close();
    }

    public cancel(): void {
        this.activeModal.dismiss();
    }
}
