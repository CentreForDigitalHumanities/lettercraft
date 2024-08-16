import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BaseModalComponent } from "@shared/base-modal/base-modal.component";

interface ModalConfig {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    confirmValue?: unknown;
    cancelValue?: unknown;
    dismissValue?: unknown;
}

@Injectable({
    providedIn: "root",
})
export class ModalService {
    constructor(private modal: NgbModal) {}

    public openConfirmationModal(config: ModalConfig): Promise<boolean> {
        const modal = this.modal.open(BaseModalComponent);
        const { title, message, confirmText, cancelText } = config;
        modal.componentInstance.title = title;
        modal.componentInstance.message = message;
        modal.componentInstance.confirmText = confirmText;
        modal.componentInstance.cancelText = cancelText;
        modal.componentInstance.confirmValue = true;
        modal.componentInstance.cancelValue = false;
        modal.componentInstance.dismissValue = false;
        return modal.result as Promise<boolean>;
    }
}
