import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SourcesComponent } from "./sources.component";

describe("SourcesComponent", () => {
    let component: SourcesComponent;
    let fixture: ComponentFixture<SourcesComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SourcesComponent],
        });
        fixture = TestBed.createComponent(SourcesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
