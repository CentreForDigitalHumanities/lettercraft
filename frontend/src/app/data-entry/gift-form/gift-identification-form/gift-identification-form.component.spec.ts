import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GiftIdentificationFormComponent } from "./gift-identification-form.component";

describe("GiftIdentificationFormComponent", () => {
    let component: GiftIdentificationFormComponent;
    let fixture: ComponentFixture<GiftIdentificationFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [GiftIdentificationFormComponent],
        });
        fixture = TestBed.createComponent(GiftIdentificationFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
