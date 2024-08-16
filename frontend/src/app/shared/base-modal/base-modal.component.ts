import { Component, inject, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "lc-base-modal",
    templateUrl: "./base-modal.component.html",
    styleUrls: ["./base-modal.component.scss"],
})
export class BaseModalComponent {
    @Input() title = "Lettercraft";
    @Input() message = "";
    @Input() confirmText = "Ok";
    @Input() cancelText = "Cancel";
    @Input() confirmValue = true;
    @Input() cancelValue = false;
    @Input() dismissValue = false;

    public activeModal = inject(NgbActiveModal);
}
