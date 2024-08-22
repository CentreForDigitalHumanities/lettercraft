import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BaseModalComponent } from "./base-modal.component";

describe("BaseModalComponent", () => {
    let component: BaseModalComponent;
    let fixture: ComponentFixture<BaseModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BaseModalComponent],
        });
        fixture = TestBed.createComponent(BaseModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have a default title", () => {
        expect(component.title).toBe("Lettercraft");
    });

    it("should emit dismiss event when dismissModal is called", () => {
        let dismissEventEmitted = false;
        component.dismiss.subscribe(() => {
            dismissEventEmitted = true;
        });
        component.dismissModal();
        expect(dismissEventEmitted).toBe(true);
    });
});
