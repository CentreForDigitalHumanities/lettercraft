import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MultiselectComponent } from "./multiselect.component";
import { SharedTestingModule } from "@shared/shared-testing.module";

describe("MultiselectComponent", () => {
    let component: MultiselectComponent;
    let fixture: ComponentFixture<MultiselectComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MultiselectComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(MultiselectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
