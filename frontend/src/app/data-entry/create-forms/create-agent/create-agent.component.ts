import { AfterViewInit, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

@Component({
  selector: 'lc-create-agent',
  templateUrl: './create-agent.component.html',
  styleUrls: ['./create-agent.component.scss']
})
export class CreateAgentComponent implements AfterViewInit {
    @Input({ required: true }) create!: Observable<void>;

    @ViewChild('createAgentModal') modalTempate?: TemplateRef<unknown>;

    modal: NgbModalRef | null = null;
    form = new FormGroup({
        name: new FormControl<string>('', {
            nonNullable: true,
            validators: Validators.required,
        }),
    });

    loading = false;

    constructor(
        private modalService: NgbModal,
    ) { }

    ngAfterViewInit(): void {
        this.create.subscribe(() =>
            this.modal = this.modalService.open(this.modalTempate)
        );
    }

    closeModal() {
        this.modal?.close();
    }

    submit() {
        this.modal?.close();
    }
}
