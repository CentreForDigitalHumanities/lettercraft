import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LetterIdentificationFormComponent } from "./letter-identification-form.component";

describe("LetterIdentificationFormComponent", () => {
    let component: LetterIdentificationFormComponent;
    let fixture: ComponentFixture<LetterIdentificationFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LetterIdentificationFormComponent],
        });
        fixture = TestBed.createComponent(LetterIdentificationFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
