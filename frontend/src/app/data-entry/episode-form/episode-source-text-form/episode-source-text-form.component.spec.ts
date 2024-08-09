import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EpisodeSourceTextFormComponent } from "./episode-source-text-form.component";

describe("EpisodeSourceTextFormComponent", () => {
    let component: EpisodeSourceTextFormComponent;
    let fixture: ComponentFixture<EpisodeSourceTextFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EpisodeSourceTextFormComponent],
        });
        fixture = TestBed.createComponent(EpisodeSourceTextFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
