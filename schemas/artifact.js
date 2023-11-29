import {createClient} from '@sanity/client'
import groq from 'groq'

export const client = createClient({
  projectId: '4udqswqp',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-10-06',
})

const isUniqueNumber = (artifactNumber, context) => {
  if (!artifactNumber) return true;
  const {document} = context

  const id = document._id.replace(/^drafts\./, '')

  const params = {
    draft: `drafts.${id}`,
    published: id,
    artifactNumber,
  }

  /* groq */
  const query = groq`!defined(*[
    _type == 'artifact' &&
    !(_id in [$draft, $published]) &&
    artifactNumber == $artifactNumber
  ][0]._id)`

  return client.fetch(query, params)
}

export default {
  name: 'artifact', // 'object' is a reserved name in Sanity. 'mObject' for 'museum object.'
  type: 'document',
  title: 'Artifact',
  groups: [
    {name: 'information', title: 'Information'},
    {name: 'images', title: 'Images'},
  ],
  preview: {
    select: {
      title: 'title',
      maker: 'maker',
      number: 'artifactNumber',
      year: 'date',
    },
    prepare(selection) {
      const {title, maker, number, year} = selection
      return {
        title: `${maker} ${title}, ${year}`,
        subtitle: number
      }
    }
  },
  fields: [
    {
      name: 'artifactNumber',
      type: 'string',
      title: 'Artifact Number',
      description: 'The artifact number, e.g. M2023.1.1.',
      validation: (Rule) => Rule.required().custom(async (value, context) => {
        const isUnique = await isUniqueNumber(value, context)
        if (!isUnique) return 'Identifier is already in use.'
        return true
      }),
      group: 'information',
    },
    {
      name: 'maker',
      type: 'string',
      title: 'Maker',
      description: 'The person or entity that created the artifact.',
      validation: (Rule) => Rule.required(),
      group: 'information',
    },
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'The artifact title, most commonly a product name.',
      validation: (Rule) => Rule.required(),
      group: 'information',
    },
    {
      name: 'date',
      type: 'string',
      title: 'Date',
      description:
        'The year of manufacture. Indicate approximate dates or ranges as "c. 2023", 2020s, 2010s-2020s, etc.',
      validation: (Rule) => Rule.required(),
      group: 'information',
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description',
      description: 'A description of the artifact, especially its relevance to the rail stories.',
      validation: (Rule) => Rule.required(),
      group: 'information',
    },
    {
      name: 'credit',
      type: 'string',
      title: 'Credit Line',
      description: "The artifact's donor or lender.",
      validation: (Rule) => Rule.required(),
      group: 'information',
    },
    {
      title: 'Artifact Images',
      name: 'artifactImages',
      type: 'array',
      description: 'Between one and four images of the artifact.',
      options: {
        layout: 'grid',
      },
      of: [
        {
          title: 'Artifact Image',
          name: 'artifactImage',
          type: 'image',
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(4),
      group: 'images',
    },
  ],
}
