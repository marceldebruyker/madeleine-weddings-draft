import type { StructureBuilder } from 'sanity/desk';

const singletonTypes = new Set(['homeHero']);
const hiddenTypes = new Set(['homeHero', 'galleryImage', 'journalPost']);

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Inhalte')
    .items([
      S.listItem()
        .title('Hero-Bereich')
        .child(
          S.document()
            .schemaType('homeHero')
            .documentId('homeHeroSingleton')
        ),
      S.divider(),
      S.listItem()
        .title('Galerie')
        .child(S.documentTypeList('galleryImage').title('Galeriebilder')),
      S.listItem()
        .title('Journal')
        .child(S.documentTypeList('journalPost').title('Journal-Beiträge')),
      ...S.documentTypeListItems().filter(
        (listItem) => !hiddenTypes.has(listItem.getId() || '')
      )
    ]);

export const defaultDocumentNode = (S: StructureBuilder, { schemaType }: { schemaType: string }) => {
  if (singletonTypes.has(schemaType)) {
    return S.document().schemaType(schemaType);
  }
  return undefined;
};
