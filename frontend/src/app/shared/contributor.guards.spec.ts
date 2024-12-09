import { TestBed } from "@angular/core/testing";
import { CanActivateFn } from "@angular/router";
import { ContributorGuard } from "./contributor.guard";



describe("LoggedOnGuard", () => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => ContributorGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeGuard).toBeTruthy();
    });
});
