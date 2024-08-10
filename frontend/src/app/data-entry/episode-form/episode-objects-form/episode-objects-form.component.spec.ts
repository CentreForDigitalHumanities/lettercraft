import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EpisodeObjectsFormComponent } from "./episode-objects-form.component";
import { SharedTestingModule } from "@shared/shared-testing.module";

describe("EpisodeObjectsFormComponent", () => {
    let component: EpisodeObjectsFormComponent;
    let fixture: ComponentFixture<EpisodeObjectsFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EpisodeObjectsFormComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(EpisodeObjectsFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
