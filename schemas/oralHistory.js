import TextAreaWithCount from '../components/wordCount'

export default {
    name: 'oralHistory',
    type: 'document',
    title: 'Oral History',
    fields: [
      {
        name: 'title',
        type: 'string',
        title: 'Title',
        description: 'A name for the clip, usually the name of the interviewee.',
        validation: Rule => Rule.required()
      },
      {
        name: 'summary',
        type: 'text',
        title: 'Summary',
        components: {
            field: TextAreaWithCount,
          },
          rows: 3,
        description: 'A summary of the clip. Include relevance to the rail content and biographical information about the interviewee, e.g. their job title and/or role.',
        validation: Rule => Rule.required(),
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
      },
    ],
  }
  