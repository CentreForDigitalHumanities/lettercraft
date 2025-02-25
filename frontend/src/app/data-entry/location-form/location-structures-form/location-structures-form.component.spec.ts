import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LocationStructuresFormComponent } from "./location-structures-form.component";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { FormService } from "../../shared/form.service";

describe("LocationStructuresFormComponent", () => {
    let component: LocationStructuresFormComponent;
    let fixture: ComponentFixture<LocationStructuresFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LocationStructuresFormComponent],
            imports: [SharedTestingModule],
            providers: [FormService],
        });
        fixture = TestBed.createComponent(LocationStructuresFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
