import { DestroyRef, Injectable } from '@angular/core';
import { CreateSpaceMutation, DataEntryCreateSpaceGQL, DataEntryCreateSpaceMutation } from 'generated/graphql';
import { MutationResult } from 'apollo-angular';
import { CreateEntityDescriptionAbstract } from './create-entity-abstract';


@Injectable()
export class CreateSpaceService extends CreateEntityDescriptionAbstract<DataEntryCreateSpaceMutation, CreateSpaceMutation> {
    relatedName = 'spaces';

    constructor(
        createMutation: DataEntryCreateSpaceGQL,
        destroyRef: DestroyRef
    ) {
        super(createMutation, destroyRef);
    }


    protected resultData(
        result: MutationResult<DataEntryCreateSpaceMutation>
    ): CreateSpaceMutation | undefined {
        return result.data?.createSpace || undefined;
    }

}
