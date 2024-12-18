import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './routes';

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        // Restores previous scroll position on backward navigation.
        // Scrolls to top on forward navigation.
        scrollPositionRestoration: 'enabled'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
