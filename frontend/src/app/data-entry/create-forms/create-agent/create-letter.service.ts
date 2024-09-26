import { DestroyRef, Injectable } from '@angular/core';
import { CreateLetterMutation, DataEntryCreateLetterGQL, DataEntryCreateLetterMutation } from 'generated/graphql';
import { MutationResult } from 'apollo-angular';
import { CreateEntityDescriptionService } from './create-entity';


@Injectable()
export class CreateLetterService extends CreateEntityDescriptionService<DataEntryCreateLetterMutation, CreateLetterMutation> {
    relatedName = 'letters';

    constructor(
        createMutation: DataEntryCreateLetterGQL,
        destroyRef: DestroyRef
    ) {
        super(createMutation, destroyRef);
    }


    protected resultData(
        result: MutationResult<DataEntryCreateLetterMutation>
    ): CreateLetterMutation | undefined {
        return result.data?.createLetter || undefined;
    }

}
