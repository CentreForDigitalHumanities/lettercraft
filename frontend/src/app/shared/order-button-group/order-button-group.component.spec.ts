import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OrderButtonGroupComponent } from "./order-button-group.component";
import { SharedTestingModule } from "@shared/shared-testing.module";

describe("OrderButtonGroupComponent", () => {
    let component: OrderButtonGroupComponent;
    let fixture: ComponentFixture<OrderButtonGroupComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [OrderButtonGroupComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(OrderButtonGroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
