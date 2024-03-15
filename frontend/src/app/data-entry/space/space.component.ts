import { Component } from '@angular/core';
import { faCancel, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'lc-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss']
})
export class SpaceComponent {
    icons = {
        confirm: faCheck,
        cancel: faCancel,
        remove: faTimes,
    }

    politicalRegions = [
        'Burgundy',
        'Provence',
        'Austrasia',
        'Aquitaine',
        'Neustria',
        'Alamannia',
        'Bavaria',
    ];

    searchPoliticalRegion: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => this.findMatches(term, this.politicalRegions))
        );

    private findMatches(term: string, values: string[]): string[] {
        if (term.length > 2) {
            const match = (value: string) => value.toLowerCase().startsWith(term.toLowerCase());
            return values.filter(match);
        }
        return [];
    }
}