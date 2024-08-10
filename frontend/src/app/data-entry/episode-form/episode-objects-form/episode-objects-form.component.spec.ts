import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EpisodeObjectsFormComponent } from "./episode-objects-form.component";

describe("EpisodeObjectsFormComponent", () => {
    let component: EpisodeObjectsFormComponent;
    let fixture: ComponentFixture<EpisodeObjectsFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EpisodeObjectsFormComponent],
        });
        fixture = TestBed.createComponent(EpisodeObjectsFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
