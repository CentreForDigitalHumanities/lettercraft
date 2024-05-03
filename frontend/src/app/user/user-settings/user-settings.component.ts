import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { User, UserSettings } from '../models/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { controlErrorMessages$, formErrorMessages$, setErrors, updateFormValidity } from '../utils';

type UserSettingsForm = { [key in keyof UserSettings]: FormControl<UserSettings[key]> };

@Component({
  selector: 'lc-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
    public form = new FormGroup<UserSettingsForm>({
        id: new FormControl<number>(-1, {
            nonNullable: true,
            validators: [
                Validators.required,
            ]
        }),
        username: new FormControl<string>('', {
            nonNullable: true,
            validators: [
                Validators.required,
            ]
        }),
        firstName: new FormControl<string>('', {
            nonNullable: true,
            validators: [
                Validators.required,
            ]
        }),
        lastName: new FormControl<string>('', {
            nonNullable: true,
            validators: [
                Validators.required,
            ]
        }),
    });

    public usernameErrors$ = controlErrorMessages$(this.form, 'username');
    public firstNameErrors$ = controlErrorMessages$(this.form, 'firstName');
    public lastNameErrors$ = controlErrorMessages$(this.form, 'lastName');
    public formErrors$ = formErrorMessages$(this.form);

    public settingsUpdatedSuccessful$ = this.authService.updateSettingsResult$.pipe(
        filter(result => !('error' in result)),
        map(() => true),
    );

    // See submit() for explanation.
    private currentUsername: string | null = null;

    constructor(
        private authService: AuthService,
        private destroyRef: DestroyRef
    ) { }

    ngOnInit(): void {
        this.authService.currentUser$
            .pipe(
                filter(user => !!user),
                takeUntilDestroyed(this.destroyRef)
            ).subscribe(user => {
                if (!user) {
                    return;
                }
                this.form.patchValue(user);
                this.currentUsername = user.username;
            });

        this.authService.updateSettingsResult$
            .pipe(
                takeUntilDestroyed(this.destroyRef)
        ).subscribe(result => {
            if ('error' in result) {
                setErrors(result.error, this.form);
            }
        });
    }

    public requestNewPassword(): void {
        // TODO: Implement!
    }

    public deleteAccount(): void {
        // TODO: Implement!
    }

    public submit(): void {
        this.form.markAllAsTouched();
        updateFormValidity(this.form);
        if (this.form.invalid) {
            return;
        }
        const patchInput = this.form.getRawValue();

        // If we send the username along, dj-auth-rest will assume it has changed, returning a 'username already taken' error if we did not change it.
        if (patchInput.username === this.currentUsername) {
            delete patchInput.username;
        }

        this.authService.updateSettings$.next(patchInput);
    }
}
