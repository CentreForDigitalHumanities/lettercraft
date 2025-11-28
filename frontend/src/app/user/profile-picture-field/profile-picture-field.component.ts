import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { Observable, BehaviorSubject, map, startWith, Subject, timestamp, withLatestFrom, switchMap, shareReplay, take } from 'rxjs';
import _ from 'underscore';

/** Adds a timestamp to a url observable
 *
 * This can be used to refresh an `<img>` element, when the image for a given path has
 * changed in the backend. Images are only refetched when `src` changes. This adds a query
 * parameter with a timestamp, which is ignored by the API but does trigger a refresh.
 */
const withTimestamp = () =>
    (url$: Observable<string | null | undefined>): Observable<string | null> =>
        url$.pipe(
            timestamp(),
            map(({value, timestamp}) => value ? `${value}?t=${timestamp}` : null),
        );

@Component({
    selector: 'lc-profile-picture-field',
    templateUrl: './profile-picture-field.component.html',
    styleUrls: ['./profile-picture-field.component.scss']
})
export class ProfilePictureFieldComponent {
    form = new FormGroup({
        file: new FormControl(''),
        fileData: new FormControl<File | null>(null),
        clear: new FormControl<boolean>(false, { nonNullable: true}),
    });

    submit$ = new Subject<typeof this.form.value>();

    saved$: Observable<string | null>;
    url$: Observable<string | null>;

    constructor(
        private authService: AuthService,
    ) {
        this.saved$ = this.submit$.pipe(
            switchMap(({fileData, clear}) => this.submitData(fileData, clear)),
            takeUntilDestroyed(),
            shareReplay(1),
        );

        this.url$ = this.saved$.pipe(
            startWith(undefined),
            withLatestFrom(this.authService.currentUser$),
            map(([newUrl, user]) => newUrl === undefined ? user?.picture : newUrl),
            withTimestamp(),
        );

        this.saved$.subscribe({
            next: () => this.resetForm(),
        })
    }

    onFileChange(event: Event) {
        const files: File[] = (event.target as any)['files'];
        const fileData = files ? _.first(files) : null;
        this.form.patchValue({ fileData });
    }

    submit(): void {
        this.submit$.next(this.form.value);
    }

    private submitData(file?: File | null, clear?: boolean): Observable<string | null> {
        if (clear) {
            return this.authService.deletePicture();
        } else if (file) {
            return this.uploadPicture(file);
        } else {
            return this.authService.currentUser$.pipe(
                take(1),
                map(user => user?.picture || null),
            );
        }
    }

    private uploadPicture(file: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.authService.uploadPicture(formData);
    }

    private resetForm() {
        this.form.reset();
    }
}
