import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { UserMenuComponent } from './menu/user-menu/user-menu.component';
import { ToastContainerComponent } from './toast-container/toast-container.component';



@NgModule({
    declarations: [
        FooterComponent,
        MenuComponent,
        UserMenuComponent,
        ToastContainerComponent,
    ],
    imports: [
        SharedModule
    ],
    exports: [
        FooterComponent,
        MenuComponent,
        ToastContainerComponent
    ]
})
export class CoreModule { }
