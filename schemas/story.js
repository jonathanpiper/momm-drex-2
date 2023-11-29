import TextAreaWithCount from '../components/wordCount'

export default {
  name: 'story',
  type: 'document',
  title: 'Story',
  fieldsets: [
    {
      name: 'audio',
      title: 'Inline audio clip',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'The title of the story.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'body',
      type: 'text',
      title: 'Body',
      components: {
        field: TextAreaWithCount,
      },
      rows: 12,
      description: 'The body of the story.',
      validation: (Rule) => Rule.required(),
    },
    {
      title: 'Hero Image',
      name: 'heroImage',
      type: 'image',
      description: 'The image that will appear in the list of stories.',
      validation: (Rule) => Rule.required(),
    },
    {
      title: 'Story Media',
      name: 'storyMedia',
      type: 'array',
      description:
        'The images or videos that will be available when viewing the story. Choose up to four images.',
      options: {
        layout: 'grid',
      },
      of: [
        {
          title: 'Story Image',
          name: 'storyImage',
          type: 'image',
          fields: [
            {
              title: 'Caption',
              name: 'caption',
              type: 'text',
              rows: 2,
              description: 'The caption that will appear under the image.',
              validation: (Rule) => Rule.required(),
            },
          ],
          validation: (Rule) => Rule.required(),
        },
        {
          title: 'Story Video',
          name: 'storyVideo',
          type: 'file',
          accept: '.mp4,.mov,.webm',
          fields: [
            {
              title: 'Thumbnail',
              name: 'thumbnail',
              type: 'image',
              description: 'A thumbnail image for the video.',
              validation: (Rule) => Rule.required(),
            },
            {
              title: 'Caption',
              name: 'caption',
              type: 'text',
              rows: 2,
              description: 'The caption that will appear under the video.',
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(4),
    },
    {
      title: 'Inline Audio Clip',
      name: 'inlineAudioClip',
      type: 'file',
      description: 'Used for including an audio clip in wav or mp3 format in a story.',
      accept: '.wav,.mp3',
      fields: [{title: 'Button Label', name: 'label', type: 'string'}],
      fieldset: 'audio',
    },
  ],
}
