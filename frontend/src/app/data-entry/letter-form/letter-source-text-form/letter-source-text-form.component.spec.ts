import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LetterSourceTextFormComponent } from "./letter-source-text-form.component";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { FormService } from "../../shared/form.service";

describe("LetterSourceTextFormComponent", () => {
    let component: LetterSourceTextFormComponent;
    let fixture: ComponentFixture<LetterSourceTextFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LetterSourceTextFormComponent],
            imports: [SharedTestingModule],
            providers: [FormService],
        });
        fixture = TestBed.createComponent(LetterSourceTextFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
