export interface UserResponse {
    id: number;
    username: string;
    is_staff: boolean;
}

export class User {
    constructor(
        public id: number,
        public username: string,
        public isStaff: boolean,
    ) { }
}
