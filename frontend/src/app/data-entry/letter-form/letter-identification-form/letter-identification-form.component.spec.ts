import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LetterIdentificationFormComponent } from "./letter-identification-form.component";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { FormService } from "../../shared/form.service";

describe("LetterIdentificationFormComponent", () => {
    let component: LetterIdentificationFormComponent;
    let fixture: ComponentFixture<LetterIdentificationFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LetterIdentificationFormComponent],
            imports: [SharedTestingModule],
            providers: [FormService],
        });
        fixture = TestBed.createComponent(LetterIdentificationFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
