import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LetterSourceTextFormComponent } from "./letter-source-text-form.component";

describe("LetterSourceTextFormComponent", () => {
    let component: LetterSourceTextFormComponent;
    let fixture: ComponentFixture<LetterSourceTextFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LetterSourceTextFormComponent],
        });
        fixture = TestBed.createComponent(LetterSourceTextFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
