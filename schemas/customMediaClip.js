export default {
    name: 'customMediaClip',
    type: 'document',
    title: 'Media Clip',
    preview: {
      select: {
        title: 'title',
        media: 'heroImage'
      },
    },
    fields: [
        {
            name: 'title',
            type: 'string',
            title: 'Title',
            description: 'A name or title for the clip to be displayed in the list of available clips.',
            validation: Rule => Rule.required()
          },
      {
        name: 'label',
        type: 'string',
        title: 'Label',
        description: 'A description for the clip to be displayed in the media player window.',
        validation: Rule => Rule.required()
      },
      {
        title: 'Hero Image',
        name: 'heroImage',
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
  