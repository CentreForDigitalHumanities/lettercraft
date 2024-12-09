import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GiftSourceTextFormComponent } from "./gift-source-text-form.component";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { FormService } from "../../shared/form.service";

describe("GiftSourceTextFormComponent", () => {
    let component: GiftSourceTextFormComponent;
    let fixture: ComponentFixture<GiftSourceTextFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [GiftSourceTextFormComponent],
            imports: [SharedTestingModule],
            providers: [FormService],
        });
        fixture = TestBed.createComponent(GiftSourceTextFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
