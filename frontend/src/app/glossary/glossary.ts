export interface GlosssaryItem {
    id: number,
    term: string,
    content: string,
}

export interface GlossarySection {
    title: string,
    items: GlosssaryItem[]
}

export interface Glossary {
    sections: GlossarySection[]
}

function* exampleItems(): Generator<GlosssaryItem, void, void> {
    for (let i = 0; i < 30; i++) {
        yield {
            id: i,
            term: `example term ${i}`,
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis felis at arcu vehicula posuere ac ac nisl. Donec accumsan purus quis tincidunt bibendum. Donec eleifend, ex eget sollicitudin fringilla, mauris tellus vulputate velit, a pellentesque lorem odio ut nunc. Donec tellus sapien, porta non blandit nec, pulvinar id massa. Vivamus odio risus, lacinia a nisi ut, vehicula rhoncus diam. Duis in pulvinar augue. Sed mauris dui, tempor sit amet ultricies a, egestas ac magna. Donec mollis sollicitudin mollis.'
        }
    }
}

export const GLOSSARY: Glossary = {
    sections: [
        {
            title: 'Letters',
            items: [
                {
                    id: 0,
                    term: 'epistola, ae, (f)',
                    content:
                        `The most frequently attested term for ‘letter’ in our corpus, together with
<em>litterae</em>. The term <em>epistola</em> derives from the Greek verb for sending
(<em>ἐπιστέλλω</em>), whereas <em>litterae</em> is the plural of the Latin term for a
writing sign, and thus evokes the act of writing. Despite being rooted in different0
aspects of the epistolary process, many authors in the corpus use them interchangeably.
Sometimes, authors will add a noun, adjective or clause to refer to a specific type of
document, e.g. <em>epistola precationis</em> (‘letter of entreaty’), <em>epistula cum
auctoritate</em> (‘royal diploma’), <em>epistola formata</em> (‘clerical introduction
letter’). In other cases, the precise meaning has to be derived from context. Of itself,
the term <em>epistola</em> is also used for charters, royal orders, and in one notable
instance, a signed agreement on who is to become the next bishop (Pass. Praeiecti, c.
13). The term <em>epistola</em> can be spelled in different ways, with <em>epistula</em>
being the main orthographical variant.`,
                },
                {
                    id: 1,
                    term: 'scriptum, i (n)',
                    content:
                        `Noun derived from the verb scribere, also used in the plural form <em>scripta</em> (lit.
‘things written’). Can denote any type of writing. A reference to a letter has be deduced
from the context, for instance the presence of a verb for sending (Greg. Hist. VI.32:
<em>qui mihi scripta remisit<em>).`,
                },
                {
                    id: 2,
                    term: 'verba, orum (n)',
                    content:
                        `Plural form of the noun <em>verbum</em> (‘word’). Typically refers to a speech, but can
also indicate a (spoken) message conveyed by legates or messengers (e.g. Greg. Hist, IX.1:
<em>recipere noluit verba eorum</em>).`
                },
            ],
        },
        {
            title: 'Gifts',
            items: [...exampleItems()],
        },
        {
            title: 'Messengers',
            items: [...exampleItems()],
        },
        {
            title: 'Actions',
            items: [...exampleItems()],
        }
    ],
};
