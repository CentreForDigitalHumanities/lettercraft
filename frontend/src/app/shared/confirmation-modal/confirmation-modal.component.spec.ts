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

    it("should have default title and message", () => {
        expect(component.title).toBe("Lettercraft");
        expect(component.message).toBe("Are you sure you want to continue?");
    });

    it("should close the modal with true when confirm is called", () => {
        spyOn(activeModal, "close");
        component.confirm();
        expect(activeModal.close).toHaveBeenCalledWith(true);
    });

    it("should close the modal with false when cancel is called", () => {
        spyOn(activeModal, "close");
        component.cancel();
        expect(activeModal.close).toHaveBeenCalledWith(false);
    });

    it("should dismiss the modal when dismiss is called", () => {
        spyOn(activeModal, "dismiss");
        component.dismiss();
        expect(activeModal.dismiss).toHaveBeenCalled();
    });
});
