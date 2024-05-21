import { Component } from '@angular/core';
import { faCheck, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Observable, OperatorFunction, debounceTime, delay, distinctUntilChanged, fromEvent, map, merge, mergeMap, switchMap, tap, timer } from 'rxjs';

@Component({
    selector: 'lc-political-region',
    templateUrl: './political-region.component.html',
    styleUrls: ['./political-region.component.scss']
})
export class PoliticalRegionComponent {
    icons = {
        info: faInfoCircle,
        confirm: faCheck,
    }

    politicalRegions = [
        'Burgundy',
        'Provence',
        'Austrasia',
        'Neustria',
        'Alamannia',
        'Bavaria',
    ];


    name$: BehaviorSubject<string> = new BehaviorSubject('');
    isLoading$: Observable<boolean>;

    constructor() {
        const delayedInput$ = this.name$.pipe(delay(600));
        this.isLoading$ = merge(
            this.name$.pipe(map(() => true)),
            delayedInput$.pipe(map(() => false)),
        )
    }

    get nameInput(): string {
        return this.name$.value;
    }
    set nameInput(value: string) {
        this.name$.next(value);
    }

    searchPoliticalRegion: OperatorFunction<string, readonly string[]> =
        (text$: Observable<string>) =>
            text$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                map(term => this.findMatches(term, this.politicalRegions))
            );

    description(name: string): string {
        if (this.exists(name)) {
            return 'Merovingian kingdom';
        } else {
            return ''
        }
    }

    exists(name: string): boolean {
        return this.politicalRegions.includes(name);
    }

    private findMatches(term: string, values: string[]): string[] {
        if (term.length > 2) {
            const match = (value: string) => value.toLowerCase().includes(term.toLowerCase());
            return values.filter(match);
        }
        return [];
    }

}
