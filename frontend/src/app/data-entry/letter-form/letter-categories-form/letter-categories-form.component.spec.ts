import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LetterCategoriesFormComponent } from "./letter-categories-form.component";
import { SharedTestingModule } from "@shared/shared-testing.module";

describe("LetterCategoriesFormComponent", () => {
    let component: LetterCategoriesFormComponent;
    let fixture: ComponentFixture<LetterCategoriesFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LetterCategoriesFormComponent],
            imports: [SharedTestingModule]
        });
        fixture = TestBed.createComponent(LetterCategoriesFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
