import { Component, DestroyRef, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "@services/auth.service";
import { UserSettings } from "../models/user";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter, map, merge, startWith } from "rxjs";
import {
    controlErrorMessages$,
    formErrorMessages$,
    setErrors,
    updateFormValidity,
} from "../utils";
import { ToastService } from "@services/toast.service";

type UserSettingsForm = {
    [key in keyof UserSettings]: FormControl<UserSettings[key]>;
};

@Component({
    selector: "lc-user-settings",
    templateUrl: "./user-settings.component.html",
    styleUrls: ["./user-settings.component.scss"],
})
export class UserSettingsComponent implements OnInit {
    public form = new FormGroup<UserSettingsForm>({
        id: new FormControl<number>(-1, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        // dj-rest-auth does not let you change your email address, so we don't need to validate it.
        email: new FormControl<string>("", {
            nonNullable: true,
        }),
        username: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required],
        }),
        firstName: new FormControl<string>("", {
            nonNullable: true,
        }),
        lastName: new FormControl<string>("", {
            nonNullable: true,
        }),
    });

    public usernameErrors$ = controlErrorMessages$(this.form, "username");
    public formErrors$ = formErrorMessages$(this.form);

    public updateSettingsLoading$ = merge(
        this.authService.updateSettings$.pipe(map(() => true)),
        this.authService.updateSettingsResult$.pipe(map(() => false)),
    ).pipe(startWith(false));

    public requestResetLoading$ = merge(
        this.authService.passwordForgotten$.pipe(map(() => true)),
        this.authService.passwordForgottenResult$.pipe(map(() => false)),
    ).pipe(startWith(false));

    public deleteUserLoading$ = merge(
        this.authService.deleteUser$.pipe(map(() => true)),
        this.authService.deleteUserResult$.pipe(map(() => false)),
    ).pipe(startWith(false));

    // See submit() for explanation.
    private currentUsername: string | null = null;

    constructor(
        private authService: AuthService,
        private toastService: ToastService,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.authService.currentUser$
            .pipe(
                filter((user) => !!user),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((user) => {
                if (!user) {
                    return;
                }
                this.form.patchValue(user);
                this.currentUsername = user.username;
            });

        this.authService.passwordForgottenResult$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (!("error" in result)) {
                    this.toastService.show({
                        header: "Password reset email sent",
                        body: "An email has been sent to you with instructions on how to reset your password.",
                        type: "success",
                    });
                }
            });

        this.authService.deleteUserResult$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if ("error" in result) {
                    this.toastService.show({
                        header: "Error deleting account",
                        body: "An error occurred while deleting your account. Please try again later.",
                        type: "danger",
                    });
                } else {
                    this.toastService.show({
                        header: "Account deleted",
                        body: "Your account has been successfully deleted.",
                        type: "success",
                    });
                }
            });

        this.authService.updateSettingsResult$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if ("error" in result) {
                    setErrors(result.error, this.form);
                } else {
                    this.toastService.show({
                        header: "Settings updated",
                        body: "Your settings have been successfully updated.",
                        type: "success",
                    });
                }
            });
    }

    public requestPasswordReset(): void {
        this.authService.passwordForgotten$.next({
            email: this.form.getRawValue().email,
        });
    }

    public deleteAccount(): void {
        this.authService.deleteUser$.next();
    }

    public submit(): void {
        this.form.markAllAsTouched();
        updateFormValidity(this.form);
        if (this.form.invalid) {
            return;
        }
        const patchInput = this.form.getRawValue();

        // If we send the username along, dj-auth-rest will assume it has changed,
        // returning a 'username already taken' error if it hasn't.
        // Therefore we remove the username from the input if it has not changed.
        if (patchInput.username === this.currentUsername) {
            delete patchInput.username;
        }

        this.authService.updateSettings$.next(patchInput);
    }
}
