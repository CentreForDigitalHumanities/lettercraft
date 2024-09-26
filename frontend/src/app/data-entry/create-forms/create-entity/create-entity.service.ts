import { Injectable } from "@angular/core";
import { CreateAgentService } from "./create-agent.service";
import { CreateGiftService } from "./create-gift.service";
import { CreateLetterService } from "./create-letter.service";
import { CreateSpaceService } from "./create-space.service";
import { CreateEntityDescriptionInput, Entity } from "generated/graphql";
import { MutationOutcome } from "./create-entity-abstract";

type CreateService = CreateAgentService | CreateGiftService | CreateLetterService | CreateSpaceService;

@Injectable()
export class CreateEntityService {
    private createServices: Record<Entity, CreateService>;

    constructor(
        createAgentService: CreateAgentService,
        createGiftService: CreateGiftService,
        createLetterService: CreateLetterService,
        createSpaceService: CreateSpaceService,
    ) {
        this.createServices = {
            [Entity.Agent]: createAgentService,
            [Entity.Gift]: createGiftService,
            [Entity.Letter]: createLetterService,
            [Entity.Space]: createSpaceService,
        };
    }

    submit(entityType: Entity, input: CreateEntityDescriptionInput): MutationOutcome<any> {
        const service = this.createServices[entityType];
        return service.submit(input);
    }
}
