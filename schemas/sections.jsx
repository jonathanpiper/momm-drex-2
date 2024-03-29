/* eslint-disable react/react-in-jsx-scope */
import {createClient} from '@sanity/client'
import groq from 'groq'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
    projectId: '4udqswqp',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2023-10-06',
})

const builder = imageUrlBuilder(client)

const getInitialIcon = async (type) => {
    const query = groq`*[_type == "sanity.imageAsset" && originalFilename == "${type}.svg"]{_id}[0]`
    const res = await client.fetch(query)
    const id = await res?._id
    return {
        _type: 'image',
        asset: {
            _ref: id,
            _type: 'reference',
        },
    }
}

const storySection = {
    type: 'object',
    title: 'Story Section',
    name: 'stories',
    preview: {
        select: {
            title: 'title',
            image: 'icon',
        },
        prepare(selection) {
            const {title, image} = selection
            return {
                title: title,
                media: (
                    <img
                        style={{backgroundColor: 'grey'}}
                        src={builder.image(image.asset._ref).url()}
                        alt="Icon"
                    />
                ),
            }
        },
    },
    fields: [
        {
            type: 'string',
            title: 'Display Title',
            name: 'title',
            initialValue: 'Stories',
        },
        {
            type: 'image',
            title: 'Icon',
            name: 'icon',
            initialValue: async (e) => {
                return await getInitialIcon(e._type)
            },
        },
        {
            type: 'array',
            title: 'Stories',
            name: 'items',
            options: {
                modal: {
                    type: 'dialog',
                    width: 'auto',
                },
            },
            of: [
                {
                    type: 'reference',
                    to: {type: 'story'},
                },
            ],
            validation: (Rule) => Rule.unique().min(2).max(3),
        },
    ],
}

const mediaSection = {
    fieldsets: [
        {
            name: 'standardCategories',
            title: 'Standard Categories',
            options: {
                collapsible: true,
                collapsed: false,
            },
            hidden: ({parent}) => {
                return parent.custom
            },
        },
        {
            name: 'customCategories',
            title: 'Custom Category',
            options: {
                collapsible: true,
                collapsed: false,
            },
            hidden: ({parent}) => {
                return !parent.custom
            },
        },
    ],
    type: 'object',
    title: 'Media Section',
    name: 'media',
    preview: {
        select: {
            title: 'title',
            image: 'icon',
        },
        prepare(selection) {
            const {title, image} = selection
            return {
                title: title,
                media: (
                    <img
                        style={{backgroundColor: 'grey'}}
                        src={builder.image(image.asset._ref).url()}
                        alt="Icon"
                    />
                ),
            }
        },
    },
    fields: [
        {
            type: 'string',
            title: 'Display Title',
            name: 'title',
            initialValue: 'Watch+Listen',
        },
        {
            type: 'image',
            title: 'Icon',
            name: 'icon',
            initialValue: async (e) => {
                return await getInitialIcon(e._type)
            },
        },
        {
            title: 'Does the media section use custom categories?',
            name: 'custom',
            type: 'boolean',
            initialValue: false,
        },
        {
            type: 'object',
            title: 'Musical Moments',
            name: 'musicalMoments',
            fieldset: 'standardCategories',
            fields: [
                {
                    title: 'Hero Image',
                    name: 'heroImage',
                    type: 'image',
                    validation: (Rule) =>
                        Rule.required().custom((field, parent) =>
                            parent.custom && field === undefined
                                ? 'A hero image is required.'
                                : true,
                        ),
                },
                {
                    title: 'Summary',
                    name: 'summary',
                    type: 'text',
                    hidden: (e) => {
                        return e.document.identifier.substring(4, 5) !== '2'
                    },
                },
                {
                    title: 'Clips',
                    name: 'clips',
                    type: 'array',
                    of: [
                        {
                            type: 'reference',
                            to: {type: 'musicalMoment'},
                        },
                    ],
                    validation: (Rule) => Rule.unique(),
                },
            ],
        },
        {
            type: 'object',
            title: 'Factory Footage',
            name: 'factoryFootage',
            fieldset: 'standardCategories',
            fields: [
                {
                    title: 'Hero Image',
                    name: 'heroImage',
                    type: 'image',
                    validation: (Rule) => Rule.required(),
                },
                {
                    title: 'Clips',
                    name: 'clips',
                    type: 'array',
                    of: [
                        {
                            type: 'reference',
                            to: {type: 'factoryFootage'},
                        },
                    ],
                    validation: (Rule) => Rule.unique(),
                },
            ],
            hidden: (e) => {
                return e.document.identifier.substring(4, 5) === '2'
            },
        },
        {
            type: 'object',
            title: 'Oral Histories',
            name: 'oralHistories',
            fieldset: 'standardCategories',
            fields: [
                {
                    title: 'Hero Image',
                    name: 'heroImage',
                    type: 'image',
                    validation: (Rule) => Rule.required(),
                },
                {
                    title: 'Clips',
                    name: 'clips',
                    type: 'array',
                    of: [
                        {
                            type: 'reference',
                            to: {type: 'oralHistory'},
                        },
                    ],
                    validation: (Rule) => Rule.unique(),
                },
            ],
        },
        {
            type: 'object',
            title: 'Custom Clips',
            name: 'customMediaClips',
            fieldset: 'customCategories',
            fields: [
                {
                    title: 'Clips',
                    name: 'clips',
                    type: 'array',
                    of: [
                        {
                            type: 'reference',
                            to: {type: 'customMediaClip'},
                        },
                    ],
                    validation: (Rule) =>
                        Rule.unique().custom((field, parent) =>
                            !parent.custom && field === undefined
                                ? 'This field must not be empty.'
                                : true,
                        ),
                },
            ],
        },
    ],
}

const artifactSection = {
    type: 'object',
    title: 'Artifact Section',
    name: 'artifacts',
    preview: {
        select: {
            title: 'title',
            image: 'icon',
        },
        prepare(selection) {
            const {title, image} = selection
            return {
                title: title,
                media: (
                    <img
                        style={{backgroundColor: 'grey'}}
                        src={builder.image(image.asset._ref).url()}
                        alt="Icon"
                    />
                ),
            }
        },
    },
    fields: [
        {
            type: 'string',
            title: 'Display Title',
            name: 'title',
            initialValue: 'Artifacts',
        },
        {
            type: 'image',
            title: 'Icon',
            name: 'icon',
            initialValue: async (e) => {
                return await getInitialIcon(e._type)
            },
        },
        {
            type: 'array',
            title: 'Artifacts',
            name: 'items',
            of: [
                {
                    type: 'reference',
                    to: {type: 'artifact'},
                },
            ],
        },
    ],
}

export {storySection, mediaSection, artifactSection}
