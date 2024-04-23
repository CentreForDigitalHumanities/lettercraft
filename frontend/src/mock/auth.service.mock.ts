import { BehaviorSubject } from "rxjs";
import { User } from "../app/models/user";

export class AuthServiceMock {
    currentUser$ = new BehaviorSubject<User | null | undefined>(undefined);
}
