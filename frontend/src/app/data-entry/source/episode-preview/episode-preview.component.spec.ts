import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EpisodePreviewComponent } from "./episode-preview.component";

describe("EpisodePreviewComponent", () => {
    let component: EpisodePreviewComponent;
    let fixture: ComponentFixture<EpisodePreviewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EpisodePreviewComponent],
        });
        fixture = TestBed.createComponent(EpisodePreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
