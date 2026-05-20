import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'lc-download',
    standalone: false,
    templateUrl: './download.component.html',
    styleUrl: './download.component.scss'
})
export class DownloadComponent {
    @ViewChild('downloadModal') modalTemplate?: TemplateRef<HTMLElement>;

    modal: NgbModalRef | null = null;

    constructor(
        private modalService: NgbModal,
    ) {}

    open() {
        this.modal = this.modalService.open(this.modalTemplate);
    }

    close() {
        this.modal?.close();
    }
}
