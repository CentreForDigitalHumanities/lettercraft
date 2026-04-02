import _ from "underscore";

export interface APIGlossaryItem {
    id: number,
    term: string,
    category: number,
    description: string,
}

export interface GlosssaryItem {
    id: number,
    term: string,
    description: string,
}

export interface GlossarySection {
    title: string,
    items: GlosssaryItem[]
}

export interface Glossary {
    sections: GlossarySection[]
}

const sectionTitles: [number, string][] = [
    [1, 'Letters'],
    [2, 'Gifts'],
    [3, 'Messengers'],
    [4, 'Actions'],

]

export const parseGlossary = (data: APIGlossaryItem[]): Glossary => {
    const sectionData = _.groupBy(data, 'category');
    const sections: GlossarySection[] = sectionTitles.map(([key, title]) => ({
        title,
        items: sectionData[key],
    }));
    return { sections };
};
