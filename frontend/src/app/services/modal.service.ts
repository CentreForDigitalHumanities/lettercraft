import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationModalComponent } from "@shared/confirmation-modal/confirmation-modal.component";

interface ConfirmationModalConfig {
    title: string;
    message: string;
}

@Injectable({
    providedIn: "root",
})
export class ModalService {
    constructor(private modal: NgbModal) {}

    public openConfirmationModal(config: ConfirmationModalConfig): Promise<any> {
        const modal = this.modal.open(ConfirmationModalComponent);
        const { title, message } = config;
        modal.componentInstance.title = title;
        modal.componentInstance.message = message;
        return modal.result;
    }
}
