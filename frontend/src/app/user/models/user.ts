export interface UserResponse {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
}

export class User {
    constructor(
        public id: number,
        public username: string,
        public email: string,
        public firstName: string,
        public lastName: string,
        public isStaff: boolean,
    ) { }
}

export interface UserRegistration {
    username: string;
    email: string;
    password1: string;
    password2: string;
}

export interface UserLogin {
    username: string;
    password: string;
}

export interface PasswordReset {
    uid: string;
    token: string;
    new_password1: string;
    new_password2: string;
}

export interface PasswordForgotten {
    email: string;
}
