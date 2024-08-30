import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { LetterFormComponent } from "./letter-form.component";
import { LetterCategoriesFormComponent } from "./letter-categories-form/letter-categories-form.component";
import { LetterSourceTextFormComponent } from "./letter-source-text-form/letter-source-text-form.component";
import { LetterIdentificationFormComponent } from "./letter-identification-form/letter-identification-form.component";

@NgModule({
    declarations: [
        LetterFormComponent,
        LetterCategoriesFormComponent,
        LetterSourceTextFormComponent,
        LetterIdentificationFormComponent,
    ],
    imports: [SharedModule],
    exports: [LetterFormComponent],
})
export class LetterFormModule {}
