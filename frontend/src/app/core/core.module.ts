import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';



@NgModule({
    declarations: [
        FooterComponent,
        MenuComponent,
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
