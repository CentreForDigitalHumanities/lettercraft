# Lettercraft dataset

This dataset was created as part of the project *Lettercraft and Epistolary Performance in Medieval Europe*, a NWO-Vidi funded project based in the Department of Languages, Literature, and Culture at Utrecht University. The database came about in collaboration with Utrecht University’s Centre for Digital Humanities, who developed the online infrastructure, and with the help of students from Utrecht University Research Master’s Programme in Ancient, Medieval & Renaissance Studies, who joined the project as research apprentices.

For more information about the project, visit the [Lettercraft website](https://lettercraft.hum.uu.nl). Here you can also browse the latest version of the data.

## About the project

How did early medieval societies use the letter and who were among its users? The Lettercraft-project approaches the early medieval letter as a performative medium, whose communicative potential was defined principally by non-textual features: its materiality, its ability to be publicly read out and talked over, and its potential quickly to reach wide and diverse audiences.

The project submits that the letter was a far more inclusive medium than is commonly assumed on the basis of its textual qualities. Literacy or social status were not required to participate in what the project calls *lettercraft*, i.e. the various performative actions (e.g. listening, speaking, negotiating, gossiping) that along with writing and reading made up epistolary communication. The project aims to show, moreover, that due to its public nature and social range, the letter was an essential tool of community-building and conflict-resolution in medieval society. As long as it was properly performed, a single letter could persuade an entire community.

The project studies the performative potential of the letter in the context of the Merovingian Kingdoms, 476-751 CE, whose communicative networks covered much of Europe. Innovatively, it relies not on the surviving letter-collections, which showcase the literary exploits of elite ecclesiastical men, but rather on descriptions of lettercraft in Merovingian histories and saint-lives.

The project proceeds along two complementary pathways. First, it has established an *index of Merovingian epistolary terminology* that is sensitive to all (textual and non-textual) aspects of lettercraft. This index can be consulted in the glossary provided on the Lettercraft website.

Second, the project is developing a *new open access dataset of Merovingian epistolary communication*, which records descriptions of letter-use documented in Merovingian narrative sources. Significantly, it is a dataset not of letters and their textual contents, but of the non-textual ‘metadata’ surrounding the epistolary process, including references to participants, delivery, performance, gift-giving, materiality, and audience.  This enables users to analyses the social contexts in which early medieval epistolary communication took place, the diverse individuals and groups who participated in it, and the actions they performed.

## About the dataset

**Corpus** – This dataset contains annotations on the use of letters in early medieval narrative texts. The project’s principal source are the eight volumes of Merovingian narrative texts edited by Bruno Krusch and Wilhelm Levison for the Monumenta Germaniae Historica under the header [*Scriptores rerum Merovingicarum*](https://www.dmgh.de/ss_rer_merov.htm) (1885-1951), complemented with a smaller corpus of Merovingian texts not edited in this collection. NB: the annotation of this corpus is still ongoing. A full list of texts presently included in the database is available under source texts. Specific information on date, authorship, editions and translations is given with each individual text.

In terms of provenance, most of the texts in the database can be said to have originated in the Frankish kingdoms under Merovingian rule in the period 450-750, but we have followed the MGH editions in not keeping to a strict chronological or geographical demarcation. The dataset thus includes texts from later times, especially the Carolingian period (e.g. Walafrid’s *Vita Galli*), and texts from neighbouring regions whose narratives are (partly) situated in the Merovingian kingdoms (e.g. Stephen of Ripon’s *Vita Wilfrithi*, Bede’s *Historia ecclesiastica*). Furthermore, project-members and student apprentices have occasionally used the database infrastructure to pursue study of early medieval texts not directly associated with the Merovingian world (e.g. Eugippius’ *Vita Severini*). We have kept these texts in the database as they offer valuable data of themselves as well as relevant points of comparison.

**Data & data structure** – The dataset consists of narrative descriptions of epistolary communication. Some descriptions recount historical events. Others are partly or entirely fictional. All were composed retrospectively and from a particular political or literary agenda. The data collected in the database should thus be characterised as narrative rather than historical.

The data is organised per source text. Within a text, the principal unit of analysis is the *epistolary episode*, a narrative segment in which some form of epistolary communication takes place. In order for an epistolary episode to have been incorporated in the database, one of four criteria was met:

1. The passage contains an explicit reference to a letter, typically expressed by the use of a relevant Latin term for letter as mapped out in the glossary.
2. The passage suggests or implies the use of a letter, typically expressed by the use of a relevant Latin verb for sending, receiving, ordering, summoning, or inviting, as listed in the glossary.
3. The passage contains an explicit reference to a messenger or legate, typically expressed  by the use of a relevant Latin term for messenger as mapped out in the glossary.
4. The passage explicitly refers to ‘something’ being sent, delivered or received, typically expressed by the use of a relevant Latin verb for sending or receiving as listed in the glossary. NB: this covers both material things (e.g. letters, gifts, other objects and  written documents) and certain immaterial communications (e.g. an oral message, a vision)

Epistory episodes include a fixed set of  data fields. This includes a summary of the episode, a list of labels drawing attention to noteworthy narrative features (e.g. secret communication, female correspondent), and a list of so-called designators, i.e. relevant Latin terms used to describe the epistolary process. Furthermore, each episode gives a list of the narrative agents, letters, gifts, and locations that are featured across the episode.

**Data collection** – The data was collected and annotated by human researchers. Each text lists the project members and student apprentices involved in the annotation process. Typically, a text would first be analysed using Brepols’ full-text database search-tool to map out relevant epistolary terminology. The Latin texts would then be read through and analysed in their entirety, aided, were possible, by modern translations. The database entries were composed by filling in a digital annotation form developed by the Centre for Digital Humanities. No generative AI was used to fill in the database forms.

The Lettercraft dataset offers these annotations as standalone files to facilitate further analysis. We encourage researchers to re-use, analyse, or build on the dataset.

## Contents

The data is offered in multiple formats to support different research methods. We offer a JSON format that is suitable for distant reading, and a DOCX format that is suitable for close reading.

`data.json` contains the dataset as a single JSON file. This format is suitable for programming languages like Python or R, or to use in web applications. `data.schema.json` provides a technical specification of the data format, using the [JSON schema](https://json-schema.org/) convention.

`data.docx` presents the dataset in a DOCX file, which is more suitable for human readers. You can use this in programs like Microsoft Word or Nvivo. This file contains the same data as the JSON file, but does not include unique identifiers for objects.

`CITATION.cff` contains metadata for citation. This uses the [citation file format](https://citation-file-format.github.io/).

## Licence

This dataset is licensed under a [Creative Commons Attribution 4.0 International licence](https://creativecommons.org/licenses/by/4.0/).

## Citation

To cite this dataset in your research, please use the metadata specified in [CITATION.cff](./CITATION.cff) or in Zenodo.

## Contact

For questions, please contact the Centre for Digital Humanities at cdh@uu.nl
