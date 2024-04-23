import { BehaviorSubject, Observable, of } from "rxjs";
import { User } from "../app/models/user";

export class AuthServiceMock {
    currentUser$ = new BehaviorSubject<User | null | undefined>(undefined);

    _setUser(value: User | null | undefined): void {
        this.currentUser$.next(value);
    }

    login(username: string, password: string): Observable<User | null> {
        return of(new User(0, username, false));
    }
}
