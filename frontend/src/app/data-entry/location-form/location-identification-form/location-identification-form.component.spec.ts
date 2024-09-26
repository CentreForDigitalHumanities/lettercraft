import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LocationIdentificationFormComponent } from "./location-identification-form.component";

describe("LocationIdentificationFormComponent", () => {
    let component: LocationIdentificationFormComponent;
    let fixture: ComponentFixture<LocationIdentificationFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LocationIdentificationFormComponent],
        });
        fixture = TestBed.createComponent(LocationIdentificationFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
