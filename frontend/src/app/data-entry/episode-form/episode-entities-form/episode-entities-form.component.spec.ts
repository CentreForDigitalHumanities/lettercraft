import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EpisodeEntitiesFormComponent } from "./episode-entities-form.component";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { FormService } from "../../shared/form.service";

describe("EpisodeEntitiesFormComponent", () => {
    let component: EpisodeEntitiesFormComponent;
    let fixture: ComponentFixture<EpisodeEntitiesFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EpisodeEntitiesFormComponent],
            providers: [FormService],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(EpisodeEntitiesFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
