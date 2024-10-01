import { TestScheduler } from "rxjs/testing";
import { isLoading } from "./request-utils";

describe('isLoading', () => {
    let scheduler: TestScheduler;

    beforeEach(() => {
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    })

    it('should show the status of a succesful request', () => {
        scheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const request$ = cold('---a|');
            const isLoading$ = request$.pipe(isLoading());
            const expected = 'b---(c|)';

            expectObservable(isLoading$).toBe(expected, { b: true, c: false });
        });
    });

    it('should show the status of a failed request', () => {
        scheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const request$ = cold('---#');
            const isLoading$ = request$.pipe(isLoading());
            const expected = 'b--(c|)';

            expectObservable(isLoading$).toBe(expected, { b: true, c: false });
        });
    })
});
