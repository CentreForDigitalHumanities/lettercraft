import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HistoricalPersonSelectComponent } from "./historical-person-select.component";
import { SharedTestingModule } from "@shared/shared-testing.module";

describe("HistoricalPersonSelectComponent", () => {
    let component: HistoricalPersonSelectComponent;
    let fixture: ComponentFixture<HistoricalPersonSelectComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [HistoricalPersonSelectComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(HistoricalPersonSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
