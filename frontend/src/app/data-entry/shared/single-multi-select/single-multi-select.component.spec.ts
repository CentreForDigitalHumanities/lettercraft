import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SingleMultiSelectComponent } from "./single-multi-select.component";
import { SharedTestingModule } from "@shared/shared-testing.module";

describe("HistoricalPersonSelectComponent", () => {
    let component: SingleMultiSelectComponent;
    let fixture: ComponentFixture<SingleMultiSelectComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SingleMultiSelectComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(SingleMultiSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
