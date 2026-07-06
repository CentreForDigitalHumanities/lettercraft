import _ from "underscore";

export interface APIGlossaryItem {
    id: number,
    term: string,
    category: number,
    description: string,
}

export interface APIGlossaryReference {
    id: number,
    name: string,
    category: number,
    reference: string,
}

export interface GlossaryItem {
    id: number,
    term: string,
    description: string,
}

export interface GlossarySection {
    title: string,
    items: GlossaryItem[]
}

export interface Glossary {
    sections: GlossarySection[]
}

const sectionTitles: [number, string][] = [
    [1, 'Letters'],
    [2, 'Gifts'],
    [3, 'Messengers'],
    [4, 'Actions'],

];

export const parseGlossary = (data: APIGlossaryItem[]): Glossary => {
    const sectionData = _.groupBy(data, 'category');
    const sections: GlossarySection[] = sectionTitles.map(([key, title]) => ({
        title,
        items: sectionData[key],
    }));
    return { sections };
};

const refSectionTitles: [number, string][] = [
    [1, 'Primary sources'],
    [2, 'Dictionaries & reference works'],
    [3, 'Secondary literature'],

];

export interface References {
    sections: {
        title: string,
        items: {
            id: number,
            name: string,
            reference: string,
        }[]
    }[],
};

export const parseReferences = (data: APIGlossaryReference[]): References => {
    const sectionData = _.groupBy(data, 'category');
    const sections = refSectionTitles.map(([key, title]) => ({
        title,
        items: sectionData[key],
    }));
    return { sections };
};
