export const agents = [
    {
        id: 1,
        name: 'Columbanus',
        description: 'Irish saint',
        isGroup: false,
    }, {
        id: 2,
        name: 'Gallus',
        description: 'Irish saint; follower of Columbanus',
        isGroup: false,
    }, {
        id: 3,
        name: 'other members of Columbanus\' party',
        description: '',
        isGroup: true,
    }, {
        id: 4,
        name: 'Theodoric II',
        description: 'Merovingian king of Burgundy',
        isGroup: false,
    }, {
        id: 5,
        name: 'Brunhilde',
        description: 'Queen regent, grandmother of Theorodic',
        isGroup: false,
    }, {
        id: 6,
        name: 'anonymous royal legates (legatarii)',
        description: '',
        isGroup: true,
    }, {
        id: 7,
        name: 'Duke Cunzo',
        description: 'Duke of Alemannia',
        isGroup: false,
    }, {
        id: 8,
        name: 'the citizens of Bregenz',
        description: '',
        isGroup: true,
    }, {
        id: 9,
        name: 'anonymous royal messengers (nuntii)',
        description: '',
        isGroup: true,
    }, {
        id: 10,
        name: 'Willimar',
        description: 'priest in Arbon',
        isGroup: false,
    }, {
        id: 11,
        name: 'Hiltibold',
        description: 'deacon of Arbon',
        isGroup: false,
    }, {
        id: 12,
        name: 'Gaudentius',
        description: 'bishop of Konstanz',
        isGroup: false,
    }, {
        id: 13,
        name: 'anonymous messenger',
        description: '',
        isGroup: false,
    }, {
        id: 14,
        name: 'Fridiburga',
        description: 'daughter of Duke Cunzo',
        isGroup: false,
    }, {
        id: 15,
        name: 'Sigibert II',
        description: 'king of Austrasia, son of Theuderic II',
        isGroup: false,
    }, {
        id: 16,
        name: 'anonymous ducal messengers',
        description: 'messengers sent by Duke Cunzo',
        isGroup: true,
    }, {
        id: 17,
        name: 'two anonymous Austrasian bishops',
        description: 'bishops sent by King Sigibert',
        isGroup: true,
    }, {
        id: 18,
        name: 'ducal henchmen (satellites)',
        description: 'commaned by Duke Cunzo',
        isGroup: true,
    }, {
        id: 19,
        name: 'the Deacon Johannes',
        description: 'deacon in Grabs',
        isGroup: false,
    }, {
        id: 20,
        name: 'ducal legates (legatis)',
        description: 'legates from Duke Cunzo',
        isGroup: true,
    }, {
        id: 21,
        name: 'spirit',
        description: 'an unclean spirit posessing Fridiburga',
        isGroup: false,
    }
]

export const episodes = [
    {
        order: '1',
        chapter: 'Cap. 3',
        title: 'Royal messengers carrying a letter',
        summary: 'Theoderic and Brunhilde dispatch an embassy with a letter, ordering Columbanus’ party to leave Burgundy',
        agents: [agents[0], agents[1], agents[2], agents[3], agents[4], agents[5]],
        locations: [],
    }, {
        order: '2',
        chapter: 'Cap. 8',
        title: 'Ducal messengers arrive',
        summary: 'After complaints by the citizens of Bregenz, Duke Cunzo sends messengers, ordering Columbanus’ party to leave Bregenz; after two members of Columbanus’ party have been killed by robbers, another ducal messenger arrive ordering them to leave',
        agents: [agents[0], agents[1], agents[2], agents[6], agents[7], agents[8]]
    }, {
        order: '3',
        chapter: 'Cap. 14',
        title: 'A message about the death of a Bishop',
        summary: 'A messenger arrives at the residence of priest Willimar in Arbon, announcing to the priest, Gallus and Hiltibold that bishop Gaudentius of Konstanz has died, prompting all who are present to start weeping and praying',
        agents: [agents[1], agents[9], agents[10], agents[11], agents[12]]
    }, {
        order: '4a',
        chapter: 'Cap. 15',
        title: 'Duke Cunzo summons Gallus',
        summary: 'Duke Cunzo sends a letter to priest Willimar, ordering him to convene at the villa of Überlingen in twelve days and to take the holy man with him, in order cure his daughter Fridiburga from demonic possession',
        agents: [agents[1], agents[9], agents[10], agents[6], agents[13]]
    }, {
        order: '4b',
        chapter: 'Cap. 15',
        title: 'Duke Cunzo petitions the king',
        summary: 'Duke Cunzo sends messengers to king Theuderic, his daughter’s fiancé, to inform him about her demonic possession',
        agents: [agents[6], agents[13], agents[14], agents[15]]
    }, {
        order: '4c',
        chapter: 'Cap. 15',
        title: 'King Sigibert responds',
        summary: 'King Sigibert sends two bishops to Fridiburga, carrying gifts; they are to cure her through prayer.',
        agents: [agents[6], agents[13], agents[14], agents[16]]
    }, {
        order: '4d',
        chapter: 'Cap. 15',
        title: 'Gallus lays a false epistolary trail',
        summary: 'Willimar fears the duke will send his henchmen to collect Gallus if he ignores the ducal summons. Gallus flees, first, to his cell, and then with two brethren to Raetia Curiensis, telling his other brothers to lie about his whereabouts: he has gone to Italy, summoned by a letter from his master Columbanus. He finds refuge in village of Grabs, hosted by the deacon Johannis, who does not recognize him.',
        agents: [agents[1], agents[9], agents[6], agents[13], agents[17], agents[18]]
    }, {
        order: '5a',
        chapter: 'Cap. 16',
        title: 'Willimar informs the Duke',
        summary: 'Willimar travels by boat (navem) to Überlingen and tells the duke about Gallus’ travels; the duke sends legates to collect the holy man, promising he will make him new bishop of Konstanz; Willimar also promises to find him, and sails back to Arbona/Arbon',
        agents: [agents[9], agents[6], agents[19]]
    }, {
        order: '5b',
        chapter: 'Cap. 16',
        title: 'Two episcopal legates arrive',
        summary: 'The bishops sent by the king arrive at the ducal palace presenting royal gifts to the possessed Fridiburga; she smashes the gifts they present and tries to kill them with one of their swords; the spirit possessing her reports on their sins, and prophesies only Gallus can save Fridiburga; one of the bishops slaps her, thinking the spirit is talking about a chicken/rooster (gallinatio). After three days, the bishops leave and report to the king.',
        agents: [agents[6], agents[13], agents[19], agents[14], agents[20]]

    },
];
