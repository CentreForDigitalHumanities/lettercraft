import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LabelSelectComponent } from "./label-select.component";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { DataEntrySharedModule } from "../data-entry-shared.module";

describe("LabelSelectComponent", () => {
    let component: LabelSelectComponent;
    let fixture: ComponentFixture<LabelSelectComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LabelSelectComponent],
            imports: [SharedTestingModule, DataEntrySharedModule],
        });
        fixture = TestBed.createComponent(LabelSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
