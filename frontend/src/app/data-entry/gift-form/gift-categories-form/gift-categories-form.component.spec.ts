import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GiftCategoriesFormComponent } from "./gift-categories-form.component";
import { SharedTestingModule } from "@shared/shared-testing.module";

describe("GiftCategoriesFormComponent", () => {
    let component: GiftCategoriesFormComponent;
    let fixture: ComponentFixture<GiftCategoriesFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [GiftCategoriesFormComponent],
            imports: [SharedTestingModule]
        });
        fixture = TestBed.createComponent(GiftCategoriesFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
