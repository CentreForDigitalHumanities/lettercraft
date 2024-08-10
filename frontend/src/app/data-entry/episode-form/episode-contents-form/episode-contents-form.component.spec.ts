import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EpisodeContentsFormComponent } from "./episode-contents-form.component";

describe("EpisodeContentsFormComponent", () => {
    let component: EpisodeContentsFormComponent;
    let fixture: ComponentFixture<EpisodeContentsFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EpisodeContentsFormComponent],
        });
        fixture = TestBed.createComponent(EpisodeContentsFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
