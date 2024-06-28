import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter, map, share, startWith } from "rxjs";
import { Location } from "@angular/common";

@Injectable({
    providedIn: "root",
})
export class CurrentPathService {
    /**
     * Observable stream of the currently navigated-to path, e.g. '/about', '/home'.
     */
    public path$ = this.router.events.pipe(
        filter(
            (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        map((event) => event.url),
        startWith(this.location.path()),
        share()
    );

    /**
     * Observable that emits a boolean value whether the user is currently on the "/login" page.
     */
    public onLoginPage$ = this.path$.pipe(
        map((path) => path.startsWith("/login"))
    );

    constructor(private location: Location, private router: Router) {}
}
