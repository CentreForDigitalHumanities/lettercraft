import { User, UserResponse } from "../models/user";
import _ from 'underscore';

/* Transforms backend user response to User object
*
* @param result User response data
* @returns User object
*/
export const parseUserData = (result: UserResponse | null): User | null => {
    if (result) {
        return new User(
            result.id,
            result.username,
            result.email,
            result.first_name,
            result.last_name,
            result.is_staff,
        );
    } else {
        return null;
    }
}

/**
 * Transfroms User data to backend UserResponse object
 *
 * Because this is used for patching, the data can be partial
 *
 * @param data (partial) User object
 * @returns UserResponse object
 */
export const encodeUserData = (data: Partial<User>): Partial<UserResponse> => {
    const encoded: Partial<UserResponse> = {
        id: data.id,
        username: data.username,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        is_staff: data.isStaff,
    };
    return _.omit(encoded, _.isUndefined);
};
