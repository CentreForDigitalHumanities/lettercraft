export const icons = {
    add: 'bi bi-plus-lg',
    remove: 'bi bi-x-lg',
    edit: 'bi bi-pencil',
    delete: 'bi bi-trash',
    create: 'bi bi-plus-lg',
    collapse: 'bi bi-caret-up',
    expand: 'bi bi-caret-down',
    info: 'bi bi-info-circle',
    cancel: 'bi bi-x-lg',
    confirm: 'bi bi-check-lg',
    episode: 'bi bi-bookmark',
    person: 'bi bi-person-fill',
    personUnknown: 'bi bi-person',
    group: 'bi bi-people',
    location: 'bi bi-geo-alt',
    letter: 'bi bi-envelope',
    gift: 'bi bi-gift',
    source: 'bi bi-book',
};

export function agentIcon(agent: any): string {
    if (agent.isGroup) {
        return icons.group;
    } else if (agent.isHistoricalFigure) {
        return icons.person;
    } else {
        return icons.personUnknown;
    }
}
