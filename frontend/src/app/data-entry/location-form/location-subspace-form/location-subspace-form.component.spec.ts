import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LocationSubspaceFormComponent } from "./location-subspace-form.component";

describe("LocationSubspaceFormComponent", () => {
    let component: LocationSubspaceFormComponent;
    let fixture: ComponentFixture<LocationSubspaceFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LocationSubspaceFormComponent],
        });
        fixture = TestBed.createComponent(LocationSubspaceFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
