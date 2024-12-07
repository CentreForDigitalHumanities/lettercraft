import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AgentHistoricalPersonFormComponent } from "./agent-historical-person-form.component";

describe("AgentHistoricalPersonFormComponent", () => {
    let component: AgentHistoricalPersonFormComponent;
    let fixture: ComponentFixture<AgentHistoricalPersonFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AgentHistoricalPersonFormComponent],
        });
        fixture = TestBed.createComponent(AgentHistoricalPersonFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
