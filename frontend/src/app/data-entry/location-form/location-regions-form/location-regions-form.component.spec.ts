import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LocationRegionsFormComponent } from "./location-regions-form.component";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { FormService } from "../../shared/form.service";

describe("LocationRegionsFormComponent", () => {
    let component: LocationRegionsFormComponent;
    let fixture: ComponentFixture<LocationRegionsFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LocationRegionsFormComponent],
            imports: [SharedTestingModule],
            providers: [FormService],
        });
        fixture = TestBed.createComponent(LocationRegionsFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
