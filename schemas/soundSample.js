export default {
    name: 'soundSample',
    type: 'document',
    title: 'Sound Sample',
    preview: {
        select: {
            instrument: 'instrument',
            artist: 'artist',
            image: 'thumbnail',
        },
        prepare(selection) {
            const {instrument, artist, image} = selection
            return {
                title: instrument,
                subtitle: artist,
                media: image,
            }
        },
    },
    fields: [
        {
            name: 'instrument',
            type: 'string',
            title: 'Instrument Featured',
            description: 'The maker and model of instrument that is featured in the clip.',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'artist',
            type: 'string',
            title: 'Person/performer',
            description: 'The name(s) of the people playing in the clip.',
            validation: (Rule) => Rule.required(),
        },

        {
            title: 'Thumbnail Image',
            name: 'thumbnail',
            type: 'image',
            description: 'An image that will be displayed in the list of available clips.',
            validation: (Rule) => Rule.required(),
        },
        {
            title: 'Media',
            name: 'media',
            type: 'file',
            accept: '.mp4,.mov,.webm',
            description: 'A video file in mp4, mov, or webm formats.',
            validation: (Rule) => Rule.required(),
        },
    ],
}
