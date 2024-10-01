import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LetterCategoriesFormComponent } from "./letter-categories-form.component";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { FormService } from "../../shared/form.service";

describe("LetterCategoriesFormComponent", () => {
    let component: LetterCategoriesFormComponent;
    let fixture: ComponentFixture<LetterCategoriesFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LetterCategoriesFormComponent],
            imports: [SharedTestingModule],
            providers: [FormService],
        });
        fixture = TestBed.createComponent(LetterCategoriesFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
