import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LocationSourceTextFormComponent } from "./location-source-text-form.component";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { FormService } from "../../shared/form.service";

describe("LocationSourceTextFormComponent", () => {
    let component: LocationSourceTextFormComponent;
    let fixture: ComponentFixture<LocationSourceTextFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LocationSourceTextFormComponent],
            imports: [SharedTestingModule],
            providers: [FormService],
        });
        fixture = TestBed.createComponent(LocationSourceTextFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
