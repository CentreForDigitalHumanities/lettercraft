import { BehaviorSubject } from "rxjs";
import { User } from "../app/models/user";

export class AuthServiceMock {
    currentUser$ = new BehaviorSubject<User | null | undefined>(undefined);

    setUser(value: User | null | undefined): void {
        this.currentUser$.next(value);
    }
}
