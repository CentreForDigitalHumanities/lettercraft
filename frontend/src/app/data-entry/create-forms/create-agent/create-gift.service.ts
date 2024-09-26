import { DestroyRef, Injectable } from '@angular/core';
import { CreateGiftMutation, DataEntryCreateGiftGQL, DataEntryCreateGiftMutation } from 'generated/graphql';
import { MutationResult } from 'apollo-angular';
import { CreateEntityDescriptionAbstract } from './create-entity-abstract';


@Injectable()
export class CreateGiftService extends CreateEntityDescriptionAbstract<DataEntryCreateGiftMutation, CreateGiftMutation> {
    relatedName = 'gifts';

    constructor(
        createMutation: DataEntryCreateGiftGQL,
        destroyRef: DestroyRef
    ) {
        super(createMutation, destroyRef);
    }


    protected resultData(
        result: MutationResult<DataEntryCreateGiftMutation>
    ): CreateGiftMutation | undefined {
        return result.data?.createGift || undefined;
    }

}
