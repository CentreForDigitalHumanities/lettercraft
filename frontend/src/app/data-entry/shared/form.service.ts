import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { asyncScheduler, BehaviorSubject, combineLatest, map, Observable, shareReplay, switchMap, throttleTime } from 'rxjs';
import { FormStatus } from './types';
import _ from 'underscore';

/**
 *  This service is scoped to individual form components. That is why it can access ActivatedRoute.
 */
@Injectable()
export class FormService {
    id$: Observable<string>;

    status$: Observable<FormStatus>;

    private statuses$ = new BehaviorSubject<Record<string, Observable<FormStatus>>>({});

    constructor(private route: ActivatedRoute) {
        this.id$ = this.route.params.pipe(
            map(params => params['id'])
        );
        this.status$ = this.statuses$.pipe(
            switchMap(statuses => combineLatest(_.values(statuses))),
            map(this.combinedStatus),
            throttleTime(400, asyncScheduler, { trailing: true }),
        );
    }

    attachForm(name: string, status$: Observable<FormStatus>) {
        const statuses = this.statuses$.value;
        if (_.has(statuses, name)) {
            throw Error(`A form named ${name} is already registered`);
        }
        const newValue = _.extend(statuses, { [name]: status$.pipe(shareReplay(1)) })
        this.statuses$.next(newValue);
    }

    detachForm(name: string) {
        const statuses = this.statuses$.value;
        const newValue = _.omit(statuses, name);
        this.statuses$.next(newValue);
    }

    private combinedStatus(statuses: FormStatus[]) {
        if (statuses.includes('error')) {
            return 'error';
        } else if (statuses.includes('loading')) {
            return 'loading';
        } else if (statuses.includes('invalid')) {
            return 'invalid';
        } else if (statuses.includes('saved')) {
            return 'saved';
        } else {
            return 'idle';
        }
    }
}
