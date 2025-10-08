import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'galleryImage',
  title: 'Galerie · Bild',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel (intern)',
      type: 'string',
      description: 'Interner Titel zur besseren Organisation.'
    }),
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'alt',
      title: 'Alt-Text',
      type: 'string',
      validation: (Rule) => Rule.required().error('Bitte einen Alt-Text hinterlegen.')
    }),
    defineField({
      name: 'location',
      title: 'Location / Kontext',
      type: 'string'
    }),
    defineField({
      name: 'homepageFeatured',
      title: 'Auf der Startseite anzeigen',
      type: 'boolean',
      initialValue: true
    }),
    defineField({
      name: 'priority',
      title: 'Sortierung (niedrig = oben)',
      type: 'number',
      description: 'Optional: Niedrigere Zahl = höher priorisiert.',
      validation: (Rule) => Rule.min(0).max(9999).warning('Sortierungswerte sollten zwischen 0 und 9999 liegen.')
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      media: 'image'
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || subtitle || 'Galeriebild',
        subtitle: subtitle || (title ? ' ' : 'Kein Zusatztext'),
        media
      };
    }
  }
});
