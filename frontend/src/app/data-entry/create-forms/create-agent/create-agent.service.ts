import { DestroyRef, Injectable } from '@angular/core';
import { CreateAgentMutation, DataEntryCreateAgentGQL, DataEntryCreateAgentMutation } from 'generated/graphql';
import { MutationResult } from 'apollo-angular';

import { CreateEntityDescriptionService } from './create-entity';


@Injectable()
export class CreateAgentService extends CreateEntityDescriptionService<DataEntryCreateAgentMutation, CreateAgentMutation> {
    relatedName = 'agents';

    constructor(
        createMutation: DataEntryCreateAgentGQL,
        destroyRef: DestroyRef,
    ) {
        super(createMutation, destroyRef);
    }

    protected resultData(
        result: MutationResult<DataEntryCreateAgentMutation>
    ): CreateAgentMutation | undefined {
        return result.data?.createAgent || undefined;
    }

}
