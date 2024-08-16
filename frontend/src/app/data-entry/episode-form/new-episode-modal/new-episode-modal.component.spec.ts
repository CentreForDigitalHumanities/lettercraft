import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewEpisodeModalComponent } from "./new-episode-modal.component";
import { DataEntrySharedModule } from "../../shared/data-entry-shared.module";
import { SharedTestingModule } from "@shared/shared-testing.module";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

describe("NewEpisodeModalComponent", () => {
    let component: NewEpisodeModalComponent;
    let fixture: ComponentFixture<NewEpisodeModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [NewEpisodeModalComponent],
            providers: [NgbActiveModal],
            imports: [DataEntrySharedModule, SharedTestingModule],
        });
        fixture = TestBed.createComponent(NewEpisodeModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
