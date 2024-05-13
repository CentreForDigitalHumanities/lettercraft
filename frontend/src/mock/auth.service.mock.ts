import { BehaviorSubject, Observable, of } from "rxjs";
import { User } from "../app/user/models/user";

/**
 * Utility function to create a User object for testing.
 *
 * @param data a partial User object, specifying the properties that you want to control
 * for the test. For example, if you are testing that a component displays the username
 * correctly, you can provide `{username: 'test'}`.
 * @returns a User object. Any properties not provided in `data` will be filled in with
 * default filler values.
 */
export const testUser = (data: Partial<User>): User =>
    new User(
        data.id || 0,
        data.username || 'test',
        data.email || 'test@testing.org',
        data.firstName || 'Tester',
        data.lastName || 'Testerton',
        data.isStaff || false
    );


/**
 * Can injected in place of the AuthService in unit tests
 *
 * This streamlines unit tests for components that use the authentication state, as this
 * mock service should provide the same interface but without requiring that you use spyOn
 * or HttpTestingController for every API call the AuthService would make.
 *
 * For obvious reasons, this service should be used when the focus of the test is not on
 * the AuthService, not when you are testing the AuthService itself.
 *
 * The mock service provides one new method: `_setUser`.
 */
export class AuthServiceMock {
    currentUser$ = new BehaviorSubject<User | null | undefined>(undefined);

    /**
     * Set the user state.
     * @param value new value for currentUser$
     */
    _setUser(value: User | null | undefined): void {
        this.currentUser$.next(value);
    }

    login(username: string, password: string): Observable<User | null> {
        return of(testUser({ username }));
    }
}
