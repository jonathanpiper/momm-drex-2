import {createClient} from '@sanity/client'
import groq from 'groq'
import TextAreaWithCount from '../components/wordCount'

export const client = createClient({
    projectId: '4udqswqp',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2023-10-06',
})

const isUniqueIdentifier = (identifier, context) => {
    if (!identifier) return true
    const {document} = context

    const id = document._id.replace(/^drafts\./, '')

    const params = {
        draft: `drafts.${id}`,
        published: id,
        identifier,
    }

    /* groq */
    const query = groq`!defined(*[
    _type == 'rail' &&
    !(_id in [$draft, $published]) &&
    identifier == $identifier
  ][0]._id)`

    return client.fetch(query, params)
}

export default {
    name: 'rail',
    type: 'document',
    title: 'Rail',
    preview: {
        select: {
            title: 'title',
            subtitle: 'identifier',
        },
    },
    groups: [
        {
            name: 'frontMatter',
            title: 'Front Matter',
        },
        {
            name: 'dwellScreen',
            title: 'Dwell Screen',
        },
        {
            name: 'content',
            title: 'Content',
        },
        {
            name: 'stories',
            title: 'Stories',
        },
        {
            name: 'watchListen',
            title: 'Watch + Listen',
        },
        {
            name: 'artifacts',
            title: 'Artifacts',
        },
    ],
    fields: [
        {
            title: 'Internal Identifier',
            name: 'identifier',
            type: 'string',
            description:
                "The rail's identifier according to gallery and approximate order. There can only be one rail entry per identifier. Rail identifiers follow a specific pattern, e.g. 'rail1a1' and 'rail2b'.",
            validation: (Rule) =>
                Rule.required().custom(async (value, context) => {
                    const match = value.match(/^rail\d[a-z](\d|x)?$/)
                    if (!match) return 'Rail identifiers MUST follow a specific pattern, with the word "rail", followed by the gallery number, followed by a letter indicating its position, followed by an optional number. Valid examples include "rail1a1", "rail2a", and "rail4b". The "tx" suffix is reserved specifically for spotlight rails.'
                    const isUnique = await isUniqueIdentifier(value, context)
                    if (!isUnique) return 'Identifier is already in use.'
                    return true
                }),
            group: '',
        },
        {
            title: 'Title',
            name: 'title',
            type: 'string',
            description: 'The title of the rail, matching the title of the corresponding display.',
            validation: (Rule) => Rule.required(),
            group: 'frontMatter',
        },
        {
            title: 'Date Range',
            name: 'dateRange',
            type: 'string',
            description: 'The time period covered by the rail.',
            hidden: ({document}) => {
                return document.identifier && document.identifier.indexOf('rail2') === -1
            },
            validation: (Rule) =>
                Rule.custom((range, context) => {
                    return context.document.identifier.indexOf('rail2') === -1 ? true :
                        range.match(/[0-9]{4}s to [0-9]{4}s/) !== null
                        ? true
                        : 'Date range must be in the format YYYY-YYYYs.'
                }),
            group: 'frontMatter',
        },
        {
            title: 'Body',
            name: 'body',
            type: 'text',
            description:
                'The overarching story of the display. This should match or closely follow the printed panel. Recommended word count: 150.',
            components: {
                field: TextAreaWithCount,
            },
            rows: 12,
            validation: (Rule) => Rule.required(),
            group: 'frontMatter',
        },
        {
            title: 'Dwell Screen Images',
            name: 'dwellImages',
            type: 'array',
            description: 'Select up to six images that will be displayed when the rail is idle.',
            of: [
                {
                    title: 'Dwell Image',
                    name: 'dwellImage',
                    type: 'image',
                },
            ],
            validation: (Rule) => Rule.required().min(1).max(6),
            group: 'dwellScreen',
        },
        {
            title: 'Content',
            name: 'content',
            type: 'array',
            description: 'Add content sections for stories, media, and/or artifacts.',
            of: [{type: 'stories'}, {type: 'media'}, {type: 'artifacts'}],
            options: {},
            // validation: (Rule) => Rule.max(4),
            validation: (Rule) =>
                Rule.custom((parent) => {
                    if (
                        parent.filter((c) => {
                            return c._type === 'media'
                        }).length > 1
                    ) {
                        return 'Only one Media section can be defined per rail.'
                    }
                    if (
                        parent.filter((c) => {
                            return c._type === 'artifacts'
                        }).length > 1
                    ) {
                        return 'Only one Artifacts section can be defined per rail.'
                    }
                    if (parent.length > 4) {
                        return 'Only four Content sections can be defined per rail..'
                    }
                    return true
                }),
            group: 'content',
        },
    ],
}
