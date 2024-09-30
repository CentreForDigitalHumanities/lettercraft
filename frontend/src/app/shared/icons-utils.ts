import { dataIcons } from "./icons";

export const agentIcon = (agent: { isGroup: boolean, identified: boolean }): string => {
    if (agent.isGroup) {
        return dataIcons.group;
    }
    if (agent.identified) {
        return dataIcons.personIdentified;
    }
    return dataIcons.person;
}

export const locationIcon = (location: { hasIdentifiableFeatures: boolean }): string =>
    location.hasIdentifiableFeatures ? dataIcons.locationIdentified : dataIcons.location;
