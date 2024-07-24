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
];

export const locations = [
    {
        id: 1,
        name: 'Luxeuil',
        description: 'monastery in Burgundy',
    }, {
        id: 2,
        name: 'Burgundy',
        description: 'kingdom of Theodoric II',
    }, {
        id: 3,
        name: 'Alemannia',
        description: 'Duchy',
    }, {
        id: 4,
        name: 'Lake Constance / Konstanz',
        description: 'Geography',
    }, {
        id: 5,
        name: 'Arbona/Arbon',
        description: 'City on Lake K'
    }, {
        id: 6,
        name: 'Pergentia/Brigantium/Bregenz',
        description: 'city/place on lake K'
    }, {
        id: 7,
        name: 'Überlingen/Iburningas',
        description: 'Villa on lake Konstanz',
    }, {
        id: 8,
        name: 'Royal court',
        description: '',
    }, {
        id: 9,
        name: 'Ducal villa of Überlingen',
        description: '',
    }, {
        id: 10,
        name: 'Gallus\' cell in the valley',
        description: 'future St. Gallen?'
    }, {
        id: 11,
        name: 'region of Rhaetia Curiensis',
        description: '',
    }, {
        id: 12,
        name: 'Grabs/Quadravades',
        description: 'village in Rhaetia'
    }, {
        id: 13,
        name: 'boat (navem, ratis)',
        description: 'a boat journey to Überlingen'
    }
];

export const objects = [
    {
        id: 1,
        name: 'A letter (epistola)',
        description: 'Letter ordering Columbanus\' to leave Burgundy. NB: not mentioned in earlier versions of the text',
        type: 'letter',
    }, {
        id: 2,
        name: 'Letter (epistola)',
        description: 'Letter from Cunzo to summon Gallus.',
        type: 'letter',
    }, {
        id: 3,
        name: 'Royal gifts (donis regiis)',
        description: 'Gifts from King Sigibert',
        type: 'gift',
    }, {
        id: 4,
        name: 'imaginary epistolary summons by Columbanus',
        description: 'A lie by Gallus to obscure his whereabouts',
        type: 'letter',
    }
]

export const episodes = [
    {
        order: '1',
        chapter: 'Cap. 3',
        title: 'Royal messengers carrying a letter',
        summary: 'Theoderic and Brunhilde dispatch an embassy with a letter, ordering Columbanus’ party to leave Burgundy',
        agents: [agents[4], agents[0], agents[1], agents[3], agents[5], agents[2]],
        locations: [locations[0], locations[1]],
        objects: [objects[0]]
    }, {
        order: '2',
        chapter: 'Cap. 8',
        title: 'Ducal messengers arrive',
        summary: 'After complaints by the citizens of Bregenz, Duke Cunzo sends messengers, ordering Columbanus’ party to leave Bregenz; after two members of Columbanus’ party have been killed by robbers, another ducal messenger arrive ordering them to leave',
        agents: [agents[0], agents[6], agents[1], agents[8], agents[2], agents[7],],
        locations: [locations[2], locations[3], locations[4], locations[5]],
        objects: [],
    }, {
        order: '3',
        chapter: 'Cap. 14',
        title: 'A message about the death of a Bishop',
        summary: 'A messenger arrives at the residence of priest Willimar in Arbon, announcing to the priest, Gallus and Hiltibold that bishop Gaudentius of Konstanz has died, prompting all who are present to start weeping and praying',
        agents: [agents[1], agents[11], agents[10], agents[9], agents[12]],
        locations: [locations[4]],
        objects: [],
    }, {
        order: '4a',
        chapter: 'Cap. 15',
        title: 'Duke Cunzo summons Gallus',
        summary: 'Duke Cunzo sends a letter to priest Willimar, ordering him to convene at the villa of Überlingen in twelve days and to take the holy man with him, in order cure his daughter Fridiburga from demonic possession',
        agents: [agents[1], agents[6], agents[13], agents[10], agents[9]],
        locations: [locations[6], locations[4]],
        objects: [objects[1]]
    }, {
        order: '4b',
        chapter: 'Cap. 15',
        title: 'Duke Cunzo petitions the king',
        summary: 'Duke Cunzo sends messengers to king Theuderic, his daughter’s fiancé, to inform him about her demonic possession',
        agents: [agents[6], agents[13], agents[14], agents[15]],
        locations: [locations[6], locations[7]],
        objects: [],
    }, {
        order: '4c',
        chapter: 'Cap. 15',
        title: 'King Sigibert responds',
        summary: 'King Sigibert sends two bishops to Fridiburga, carrying gifts; they are to cure her through prayer.',
        agents: [agents[6], agents[13], agents[14], agents[16]],
        locations: [locations[6], locations[8]],
        objects: [objects[2]]

    }, {
        order: '4d',
        chapter: 'Cap. 15',
        title: 'Gallus lays a false epistolary trail',
        summary: 'Willimar fears the duke will send his henchmen to collect Gallus if he ignores the ducal summons. Gallus flees, first, to his cell, and then with two brethren to Raetia Curiensis, telling his other brothers to lie about his whereabouts: he has gone to Italy, summoned by a letter from his master Columbanus. He finds refuge in village of Grabs, hosted by the deacon Johannis, who does not recognize him.',
        agents: [agents[6], agents[13], agents[1], agents[9], agents[18], agents[17]],
        locations: [locations[4], locations[9], locations[10], locations[11]],
        objects: [objects[1], objects[3]]
    }, {
        order: '5a',
        chapter: 'Cap. 16',
        title: 'Willimar informs the Duke',
        summary: 'Willimar travels by boat (navem) to Überlingen and tells the duke about Gallus’ travels; the duke sends legates to collect the holy man, promising he will make him new bishop of Konstanz; Willimar also promises to find him, and sails back to Arbona/Arbon',
        agents: [agents[6], agents[9], agents[19]],
        locations: [locations[8], locations[12]],
        objects: [],
    }, {
        order: '5b',
        chapter: 'Cap. 16',
        title: 'Two episcopal legates arrive',
        summary: 'The bishops sent by the king arrive at the ducal palace presenting royal gifts to the possessed Fridiburga; she smashes the gifts they present and tries to kill them with one of their swords; the spirit possessing her reports on their sins, and prophesies only Gallus can save Fridiburga; one of the bishops slaps her, thinking the spirit is talking about a chicken/rooster (gallinatio). After three days, the bishops leave and report to the king.',
        agents: [agents[6], agents[13], agents[14], agents[20], agents[19]],
        locations: [locations[8]],
        objects: [objects[2]],
    },
];
