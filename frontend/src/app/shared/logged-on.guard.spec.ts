import { TestBed } from "@angular/core/testing";
import { CanActivateFn } from "@angular/router";

import { LoggedOnGuard } from "./logged-on.guard";

describe("LoggedOnGuard", () => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => LoggedOnGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeGuard).toBeTruthy();
    });
});
