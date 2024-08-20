import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EpisodeLocationsFormComponent } from "./episode-locations-form.component";
import { SharedTestingModule } from "@shared/shared-testing.module";

describe("EpisodeLocationsFormComponent", () => {
    let component: EpisodeLocationsFormComponent;
    let fixture: ComponentFixture<EpisodeLocationsFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EpisodeLocationsFormComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(EpisodeLocationsFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
