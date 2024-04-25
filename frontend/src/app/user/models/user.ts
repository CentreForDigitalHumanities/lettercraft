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
