import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AgentHistoricalPersonFormComponent } from "./agent-historical-person-form.component";
import { FormService } from "../../shared/form.service";
import { SharedTestingModule } from "@shared/shared-testing.module";

describe("AgentHistoricalPersonFormComponent", () => {
    let component: AgentHistoricalPersonFormComponent;
    let fixture: ComponentFixture<AgentHistoricalPersonFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AgentHistoricalPersonFormComponent],
            imports: [SharedTestingModule],
            providers: [FormService],
        });
        fixture = TestBed.createComponent(AgentHistoricalPersonFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
