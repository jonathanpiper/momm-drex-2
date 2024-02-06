const colorsList = [
    {r: 102, g: 60, b: 18},
    {r: 205, g: 121, b: 37},
    {r: 69, g: 88, b: 26},
    {r: 132, g: 158, b: 47},
    {r: 162, g: 189, b: 76},
    {r: 89, g: 33, b: 53},
    {r: 199, g: 75, b: 119},
]

const colorOptions = {
    disableAlpha: true,
    colorList: colorsList,
}

export default {
    name: 'railConfig',
    type: 'document',
    title: 'Rail Configuration',
    initialValue: {
        title: 'Rail Configuration',
        drTitleFont: 'Montserrat',
        drBodyFont: 'Signika',
    },
    fields: [
        {
            name: 'title',
            type: 'string',
            title: 'Title',
            hidden: true,
            initialValue: 'Rail Configuration',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'drTitleFont',
            type: 'string',
            title: 'Title Font',
            description: 'The font used for titles.',
            readOnly: true,
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'drBodyFont',
            type: 'string',
            title: 'Body Font',
            description: 'The font used for body text.',
            readOnly: true,
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'gallery1',
            type: 'object',
            title: 'Gallery 1 Configuration',
            fields: [
                {
                    name: 'color',
                    title: 'Default Item Color',
                    type: 'color',
                    options: colorOptions,
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: 'activeColor',
                    title: 'Active Item Color',
                    type: 'color',
                    options: colorOptions,
                    validation: (Rule) => Rule.required(),
                },
            ],
        },
        {
            name: 'gallery2',
            type: 'object',
            title: 'Gallery 2 Configuration',
            fields: [
                {
                    name: 'color',
                    title: 'Default Item Color',
                    type: 'color',
                    options: colorOptions,
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: 'activeColor',
                    title: 'Active Item Color',
                    type: 'color',
                    options: colorOptions,
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: 'dateRangeColor',
                    title: 'Date Range Text Color',
                    type: 'color',
                    options: colorOptions,
                    validation: (Rule) => Rule.required(),
                },
            ],
        },
        {
            name: 'gallery4',
            type: 'object',
            title: 'Gallery 4 Configuration',
            fields: [
                {
                    name: 'color',
                    title: 'Default Item Color',
                    type: 'color',
                    options: colorOptions,
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: 'activeColor',
                    title: 'Active Item Color',
                    type: 'color',
                    options: colorOptions,
                    validation: (Rule) => Rule.required(),
                },
            ],
        },
    ],
}
