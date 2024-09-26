import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LocationSourceTextFormComponent } from "./location-source-text-form.component";

describe("LocationSourceTextFormComponent", () => {
    let component: LocationSourceTextFormComponent;
    let fixture: ComponentFixture<LocationSourceTextFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LocationSourceTextFormComponent],
        });
        fixture = TestBed.createComponent(LocationSourceTextFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
