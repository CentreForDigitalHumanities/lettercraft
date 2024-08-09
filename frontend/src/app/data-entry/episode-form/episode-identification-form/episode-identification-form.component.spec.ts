import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EpisodeIdentificationFormComponent } from "./episode-identification-form.component";

describe("EpisodeIdentificationFormComponent", () => {
    let component: EpisodeIdentificationFormComponent;
    let fixture: ComponentFixture<EpisodeIdentificationFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EpisodeIdentificationFormComponent],
        });
        fixture = TestBed.createComponent(EpisodeIdentificationFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
