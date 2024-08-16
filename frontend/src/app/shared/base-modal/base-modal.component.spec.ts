import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BaseModalComponent } from "./base-modal.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

describe("BaseModalComponent", () => {
    let component: BaseModalComponent;
    let fixture: ComponentFixture<BaseModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BaseModalComponent],
            providers: [NgbActiveModal],
        });
        fixture = TestBed.createComponent(BaseModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
