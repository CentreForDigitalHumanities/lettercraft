import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewEpisodeFormComponent } from "./new-episode-form.component";
import { DataEntrySharedModule } from "../../shared/data-entry-shared.module";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

describe("NewEpisodeFormComponent", () => {
    let component: NewEpisodeFormComponent;
    let fixture: ComponentFixture<NewEpisodeFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [NewEpisodeFormComponent],
            providers: [NgbActiveModal],
            imports: [DataEntrySharedModule, SharedTestingModule],
        });
        fixture = TestBed.createComponent(NewEpisodeFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
