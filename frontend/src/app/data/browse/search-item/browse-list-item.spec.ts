import { BrowseAgentsPageQuery, BrowseEpisodesPageQuery, BrowseGiftsPageQuery, BrowseLettersPageQuery, BrowseLocationsPageQuery, BrowseSourcesPageQuery } from "generated/graphql";
import { EntityListItem, transformAgent, transformEpisode, transformGift, transformLetter, transformLocation, transformSource } from "./browse-list-item";
import { dataIcons } from "@shared/icons";

describe('transformSource', () => {
    let data: BrowseSourcesPageQuery['sources'][number];

    beforeEach(() => {
        data = {
            id: '1',
            name: 'Test Source',
            descriptionText: 'Test description',
            reference: 'REF-1',
            episodes: [{ id: '2' }],
        };
    });

    it('transforms sources correctly', () => {
        expect(transformSource(data)).toEqual({
            id: '1',
            name: 'Test Source',
            description: 'Test description',
            type: 'source',
            icon: dataIcons.source,
            link: '/data/sources/1',
            numOfEpisodes: 1,
        });
    });
});

describe('transformEpisode', () => {
   let data: BrowseEpisodesPageQuery['episodes'][number];

    beforeEach(() => {
        data = {
            id: '2',
            name: 'Test Episode',
            summary: 'Test summary',
            book: "1",
            chapter: "2",
            page: "10",
            source: {
                id: '1',
                name: 'REF-1'
            },
            categories: [{
                id: 'cat1',
                name: 'Category1'
            }],
            designators: [],
            agents: [{ id: '1', agent: { id: '3', name: 'Agent 1', isGroup: false, identified: true } }],
            letters: [{ id: '1', letter: { id: '4', name: 'Letter 1' } }],
            gifts: [{ id: '1', gift: { id: '5', name: 'Gift 1' } }],
            locations: [{ id: '1', location: { id: '6', name: 'Location 1', hasIdentifiableFeatures: false } }],
        }
    });

    it('transforms episodes correctly', () => {
        expect(transformEpisode(data)).toEqual({
            id: '2',
            name: 'Test Episode',
            description: 'Test summary',
            type: 'episode',
            icon: dataIcons.episode,
            link: '/data/episodes/2',
            categories: [{ id: 'cat1', name: 'Category1' }],
            designators: [],
            source: {
                id: '1',
                name: 'REF-1'
            },
            agents: [{
                id: '3',
                name: 'Agent 1',
                icon: dataIcons.personIdentified,
                link: '/data/agents/3'
            }],
            letters: [{
                id: '4',
                name: 'Letter 1',
                icon: dataIcons.letter,
                link: '/data/letters/4'
            }],
            gifts: [{
                id: '5',
                name: 'Gift 1',
                icon: dataIcons.gift,
                link: '/data/gifts/5'
            }],
            locations: [{
                id: '6',
                name: 'Location 1',
                icon: dataIcons.location,
                link: '/data/locations/6'
            }],
            sourceLocation: {
                book: "1",
                chapter: "2",
                page: "10"
            }
        });
    });
});

describe('transformAgent', () => {
    let data: BrowseAgentsPageQuery['agentDescriptions'][number];

    beforeEach(() => {
        data = {
            id: '3',
            name: 'Test Agent',
            description: 'Agent description',
            isGroup: false,
            identified: false,
            episodes: [{ id: '2' }, { id: '3' }],
            source: { id: '1', name: 'REF-1' },
        }
    });

    it('links to the agent page', () => {
        expect(transformAgent(data).link).toBe('/data/agents/3');
    });

    it('counts occurrence data', () => {
        const result = transformAgent(data) as EntityListItem;
        expect(result.numOfEpisodes).toBe(2);
    });

    it('uses group icon for group agents', () => {
        expect(transformAgent(data).icon).toBe(dataIcons.person);

        data.isGroup = true;
        expect(transformAgent(data).icon).toBe(dataIcons.group);
    });
});

describe('transformLetter', () => {
    let data: BrowseLettersPageQuery['letterDescriptions'][number];

    beforeEach(() => {
        data = {
            id: '4',
            name: 'Test Letter',
            description: 'Letter description',
            episodes: [{ id: '2' }],
            source: {
                id: '1',
                name: 'REF-1'
            }
        };
    });

    it('links to the letter page', () => {
        expect(transformLetter(data).link).toBe('/data/letters/4');
    });
});

describe('transformGift', () => {
    let data: BrowseGiftsPageQuery['giftDescriptions'][number];

    beforeEach(() => {
        data = {
            id: '5',
            name: 'Test Gift',
            description: 'Gift description',
            episodes: [{ id: '2' }],
            source: {
                id: '1',
                name: 'REF-1'
            }
        };
    });

    it('links to the gift page', () => {
        expect(transformGift(data).link).toBe('/data/gifts/5');
    });
});

describe('transformLocation', () => {
    let data: BrowseLocationsPageQuery['spaceDescriptions'][number];

    beforeEach(() => {
        data = {
            id: '6',
            name: 'Test Location',
            description: 'Location description',
            hasIdentifiableFeatures: false,
            episodes: [{ id: '2' }],
            source: {
                id: '1',
                name: 'REF-1'
            }
        };
    });

    it('links to the location page', () => {
        expect(transformLocation(data).link).toBe('/data/locations/6');
    });
});
