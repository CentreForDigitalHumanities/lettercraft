import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PreviewNotificationComponent } from "./preview-notification.component";

describe("PreviewNotificationComponent", () => {
    let component: PreviewNotificationComponent;
    let fixture: ComponentFixture<PreviewNotificationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PreviewNotificationComponent],
        });
        fixture = TestBed.createComponent(PreviewNotificationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
