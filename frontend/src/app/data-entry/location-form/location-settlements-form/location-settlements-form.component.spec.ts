import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LocationSettlementsFormComponent } from "./location-settlements-form.component";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { FormService } from "../../shared/form.service";

describe("LocationSettlementsFormComponent", () => {
    let component: LocationSettlementsFormComponent;
    let fixture: ComponentFixture<LocationSettlementsFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LocationSettlementsFormComponent],
            imports: [SharedTestingModule],
            providers: [FormService],
        });
        fixture = TestBed.createComponent(LocationSettlementsFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
