import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EntityDescriptionLeadComponent } from "./entity-description-lead.component";

describe("EntityDescriptionLeadComponent", () => {
    let component: EntityDescriptionLeadComponent;
    let fixture: ComponentFixture<EntityDescriptionLeadComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EntityDescriptionLeadComponent],
        });
        fixture = TestBed.createComponent(EntityDescriptionLeadComponent);
        component = fixture.componentInstance;
        component.entity = { description: "test" };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
