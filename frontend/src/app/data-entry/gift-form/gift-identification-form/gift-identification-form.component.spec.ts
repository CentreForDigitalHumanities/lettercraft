import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GiftIdentificationFormComponent } from "./gift-identification-form.component";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { FormService } from "../../shared/form.service";

describe("GiftIdentificationFormComponent", () => {
    let component: GiftIdentificationFormComponent;
    let fixture: ComponentFixture<GiftIdentificationFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [GiftIdentificationFormComponent],
            imports: [SharedTestingModule],
            providers: [FormService],
        });
        fixture = TestBed.createComponent(GiftIdentificationFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
