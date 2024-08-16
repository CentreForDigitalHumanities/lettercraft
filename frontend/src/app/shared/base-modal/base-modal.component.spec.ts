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
});
