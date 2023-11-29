export default {
    name: 'musicalMoment',
    type: 'document',
    title: 'Musical Moment',
    preview: {
      select: {
        title: 'title',
        artist: 'artist',
        image: 'thumbnail'
      },
      prepare(selection) {
        const {title, artist, image} = selection
        return {
          title: title,
          subtitle: artist,
          media: image
        }
      },
    },
    fields: [
      {
        name: 'title',
        type: 'string',
        title: 'Title',
        description: 'A name for the clip, usually the name of the song/piece being performed.',
        validation: Rule => Rule.required()
      },
      {
        name: 'artist',
        type: 'string',
        title: 'Person/performer',
        description: 'The name(s) of the people playing in the clip.',
        validation: Rule => Rule.required()
      },
      {
        name: 'instrument',
        type: 'string',
        title: 'Instrument Featured',
        description: 'The maker and model of instrument that is featured in the clip.',
      },
      {
        name: 'credit',
        type: 'string',
        title: 'Credit',
        description: 'The person or entity that provided the clip.',
        validation: Rule => Rule.required()
      },
      {
        name: 'year',
        type: 'string',
        title: 'Year',
        description: 'The year that the clip was made/recorded.'
      },
      {
        title: 'Thumbnail Image',
        name: 'thumbnail',
        type: 'image',
        description: 'An image that will be displayed in the list of available clips.',
        validation: Rule => Rule.required()
      },
      {
        title: 'Media',
        name: 'media',
        type: 'file',
        accept: '.mp4,.mov,.webm',
        description: 'A video file in mp4, mov, or webm formats.',
        validation: Rule => Rule.required(),
        fields: [
          {
            name: 'static',
            type: 'boolean',
            title: 'Static clip',
            description: 'Select this if the clip is a static image with audio, rather than a video clip.',
            initialValue: false
          }
        ]
      },
    ],
  }
  