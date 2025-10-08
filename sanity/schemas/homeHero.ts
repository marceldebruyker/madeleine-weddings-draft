import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'homeHero',
  title: 'Startseite · Hero-Bereich',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline (optional)',
      type: 'string',
      description: 'Optional – falls leer, wird der Standardtext aus dem Code genutzt.'
    }),
    defineField({
      name: 'subline',
      title: 'Subline (optional)',
      type: 'text',
      rows: 3,
      description: 'Optional – falls leer, wird der Standardtext aus dem Code genutzt.'
    }),
    defineField({
      name: 'heroImages',
      title: 'Hero-Bilder',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'heroImage',
          title: 'Hero-Bild',
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt-Text',
              type: 'string',
              validation: (Rule) => Rule.required().error('Bitte einen Alt-Text hinterlegen.')
            })
          ]
        })
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .error('Bitte mindestens ein Bild hinzufügen.')
    })
  ],
  preview: {
    prepare: () => ({
      title: 'Hero-Bereich Startseite',
      subtitle: 'Steuert die Slider-Bilder'
    })
  }
});
