import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GiftSourceTextFormComponent } from "./gift-source-text-form.component";
import { SharedTestingModule } from "@shared/shared-testing.module";

describe("GiftSourceTextFormComponent", () => {
    let component: GiftSourceTextFormComponent;
    let fixture: ComponentFixture<GiftSourceTextFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [GiftSourceTextFormComponent],
            imports: [SharedTestingModule]
        });
        fixture = TestBed.createComponent(GiftSourceTextFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});