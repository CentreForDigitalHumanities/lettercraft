import { Component, DestroyRef, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "@services/auth.service";
import { UserLogin } from "../models/user";
import {
    controlErrorMessages$,
    formErrorMessages$,
    setErrors,
    updateFormValidity,
} from "../utils";
import { ToastService } from "@services/toast.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";

type LoginForm = {
    [key in keyof UserLogin]: FormControl<string>;
};

@Component({
    selector: "lc-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
    public form = new FormGroup<LoginForm>({
        username: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required],
        }),
        password: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });

    public usernameErrors$ = controlErrorMessages$(this.form, "username");
    public passwordErrors$ = controlErrorMessages$(this.form, "password");
    public formErrors$ = formErrorMessages$(this.form);

    public loading$ = this.authService.login.loading$;

    constructor(
        private authService: AuthService,
        private toastService: ToastService,
        private destroyRef: DestroyRef,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.authService.login.success$.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(() => {
            this.toastService.show({
                header: "Sign in successful",
                body: "You have been successfully signed in.",
                type: "success",
            });
            this.router.navigate(["/"]);
        });

        this.authService.login.error$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => setErrors(result.error, this.form));
    }

    public submit(): void {
        this.form.markAllAsTouched();
        updateFormValidity(this.form);
        if (!this.form.valid) {
            return;
        }
        this.authService.login.subject.next(this.form.getRawValue());
    }
}
