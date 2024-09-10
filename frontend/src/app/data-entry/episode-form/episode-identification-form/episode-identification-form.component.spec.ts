import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EpisodeIdentificationFormComponent } from "./episode-identification-form.component";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { FormService } from "../../shared/form.service";

describe("EpisodeIdentificationFormComponent", () => {
    let component: EpisodeIdentificationFormComponent;
    let fixture: ComponentFixture<EpisodeIdentificationFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EpisodeIdentificationFormComponent],
            imports: [SharedTestingModule],
            providers: [FormService],
        });
        fixture = TestBed.createComponent(EpisodeIdentificationFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
