import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LocationIdentificationFormComponent } from "./location-identification-form.component";
import { FormService } from "../../shared/form.service";
import { SharedTestingModule } from "@shared/shared-testing.module";

describe("LocationIdentificationFormComponent", () => {
    let component: LocationIdentificationFormComponent;
    let fixture: ComponentFixture<LocationIdentificationFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LocationIdentificationFormComponent],
            imports: [SharedTestingModule],
            providers: [FormService],
        });
        fixture = TestBed.createComponent(LocationIdentificationFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
