export default {
    name: 'factoryFootage',
    type: 'document',
    title: 'Factory Footage',
    fields: [
      {
        name: 'title',
        type: 'string',
        title: 'Title',
        description: 'A name for the clip, usually the name of the maker and the instrument being made.',
        validation: Rule => Rule.required()
      },
      {
        name: 'caption',
        type: 'string',
        title: 'Caption',
        description: 'A brief description of the clip.',
        validation: Rule => Rule.required()
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
  