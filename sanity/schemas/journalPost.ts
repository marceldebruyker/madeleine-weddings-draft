import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'journalPost',
  title: 'Journal · Beitrag',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'publishedAt',
      title: 'Veröffentlichungsdatum',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'coverImage',
      title: 'Titelbild',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-Text',
          type: 'string',
          validation: (Rule) => Rule.required()
        })
      ],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'excerpt',
      title: 'Kurzbeschreibung',
      type: 'text',
      rows: 3,
      validation: (Rule) =>
        Rule.max(260).warning('Kurzbeschreibung sollte höchstens 260 Zeichen lang sein.')
    }),
    defineField({
      name: 'readingTime',
      title: 'Lesedauer (z. B. "6 Min.")',
      type: 'string'
    }),
    defineField({
      name: 'categories',
      title: 'Kategorien',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'body',
      title: 'Inhalt',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Zitat', value: 'blockquote' }
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Nummeriert', value: 'number' }
          ]
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'caption',
              title: 'Bildunterschrift',
              type: 'string'
            }),
            defineField({
              name: 'alt',
              title: 'Alt-Text',
              type: 'string',
              validation: (Rule) => Rule.required()
            })
          ]
        })
      ],
      validation: (Rule) => Rule.required().min(1)
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'readingTime',
      media: 'coverImage'
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle || 'Journal-Beitrag',
        media
      };
    }
  }
});
