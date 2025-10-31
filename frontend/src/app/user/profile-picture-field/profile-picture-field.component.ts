import { Component } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Observable, BehaviorSubject, combineLatest, map, startWith, Subject, timestamp, of } from 'rxjs';
import _ from 'underscore';


@Component({
    selector: 'lc-profile-picture-field',
    templateUrl: './profile-picture-field.component.html',
    styleUrls: ['./profile-picture-field.component.scss']
})
export class ProfilePictureFieldComponent {

    pictureFile$ = new BehaviorSubject<File | undefined>(undefined);
    clearPicture$ = new BehaviorSubject<boolean>(false);
    pictureSaved$ = new Subject<void>();

    pictureUrl$ = combineLatest([
        this.authService.currentUser$,
        this.pictureSaved$.pipe(startWith(undefined))]
    ).pipe(
        map(([user, _]) => user?.picture),
        timestamp(),
        map(({value, timestamp}) => value ? `${value}?t=${timestamp}` : undefined),
    );

    constructor(
        private authService: AuthService
    ) {}

    onPictureInput(event: Event) {
        const files: File[] = (event.target as any)['files'];
        const file = files ? _.first(files) : undefined;
        this.pictureFile$.next(file);
    }

    submit(): Observable<any> {
        if (this.clearPicture$.value) {
            return this.authService.deletePicture();
        } else if (this.pictureFile$.value) {
            return this.uploadPicture(this.pictureFile$.value);
        } else {
            return of(undefined);
        }
    }

    private uploadPicture(file: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.authService.uploadPicture(formData);
    }
}
