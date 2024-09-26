import { DestroyRef, Injectable } from '@angular/core';
import { CreateLetterMutation, DataEntryCreateLetterGQL, DataEntryCreateLetterMutation } from 'generated/graphql';
import { MutationResult } from 'apollo-angular';
import { CreateEntityDescriptionAbstract } from './create-entity-abstract';


@Injectable()
export class CreateLetterService extends CreateEntityDescriptionAbstract<DataEntryCreateLetterMutation, CreateLetterMutation> {
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
