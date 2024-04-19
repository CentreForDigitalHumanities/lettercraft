import { User, UserResponse } from "../models/user";
import * as _ from 'underscore';

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
    const changeKeys = {
        isStaff: 'is_staff',
    };

    const encoded: Record<string, any> = {};

    _.keys(data).forEach(key => {
        const value = _.get(data, key);
        const path = _.get(changeKeys, key, key);
        encoded[path] = value;
    });

    return encoded;
};
