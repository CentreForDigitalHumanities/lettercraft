import { BehaviorSubject, Observable, of } from "rxjs";
import { User } from "../app/user/models/user";

export const testUser = (data: Partial<User>): User =>
    new User(
        data.id || 0,
        data.username || 'test',
        data.email || 'test@testing.org',
        data.firstName || 'Tester',
        data.lastName || 'Testerton',
        data.isStaff || false
    );


export class AuthServiceMock {
    currentUser$ = new BehaviorSubject<User | null | undefined>(undefined);

    _setUser(value: User | null | undefined): void {
        this.currentUser$.next(value);
    }

    login(username: string, password: string): Observable<User | null> {
        return of(testUser({ username }));
    }
}
