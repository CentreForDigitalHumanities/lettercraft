import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { UserMenuComponent } from './menu/user-menu/user-menu.component';



@NgModule({
    declarations: [
        FooterComponent,
        MenuComponent,
        UserMenuComponent,
    ],
    imports: [
        SharedModule
    ],
    exports: [
        FooterComponent,
        MenuComponent,
    ]
})
export class CoreModule { }
