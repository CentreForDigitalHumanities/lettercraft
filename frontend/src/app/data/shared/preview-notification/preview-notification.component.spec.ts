import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PreviewNotificationComponent } from "./preview-notification.component";
import { SharedTestingModule } from "@shared/shared-testing.module";

describe("PreviewNotificationComponent", () => {
    let component: PreviewNotificationComponent;
    let fixture: ComponentFixture<PreviewNotificationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PreviewNotificationComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(PreviewNotificationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
