import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ConfirmationModalComponent } from "./confirmation-modal.component";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

describe("ConfirmationModalComponent", () => {
    let component: ConfirmationModalComponent;
    let fixture: ComponentFixture<ConfirmationModalComponent>;
    let activeModal: NgbActiveModal;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ConfirmationModalComponent],
            imports: [SharedTestingModule],
            providers: [NgbActiveModal],
        });
        fixture = TestBed.createComponent(ConfirmationModalComponent);
        component = fixture.componentInstance;
        activeModal = TestBed.inject(NgbActiveModal);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have a default message", () => {
        expect(component.message).toBe("Are you sure you want to continue?");
    });

    it("should close the modal with true when confirm is called", () => {
        spyOn(activeModal, "close");
        component.confirm();
        expect(activeModal.close).toHaveBeenCalled();
    });

    it("should close the modal when cancel is called", () => {
        spyOn(activeModal, "dismiss");
        component.cancel();
        expect(activeModal.dismiss).toHaveBeenCalled();
    });
});
