import { createClient } from '@sanity/client';
import groq from 'groq';
import type { PortableTextBlock } from '@portabletext/types';
import { galleryItems as fallbackGalleryItems } from '../data/gallery';

type HeroImage = {
  src: string;
  alt: string;
};

export type GalleryImage = {
  _id?: string;
  src: string;
  alt: string;
  location?: string;
  homepageFeatured?: boolean;
};

export type JournalPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverUrl?: string;
  coverAlt?: string;
  readingTime?: string;
  publishedAt?: string;
  categories?: string[];
  body?: PortableTextBlock[];
};

const projectId =
  import.meta.env.PUBLIC_SANITY_PROJECT_ID ||
  import.meta.env.SANITY_STUDIO_PROJECT_ID ||
  import.meta.env.SANITY_PROJECT_ID;

const dataset =
  import.meta.env.PUBLIC_SANITY_DATASET ||
  import.meta.env.SANITY_STUDIO_DATASET ||
  import.meta.env.SANITY_DATASET;

const apiVersion =
  import.meta.env.PUBLIC_SANITY_API_VERSION ||
  import.meta.env.SANITY_API_VERSION ||
  '2024-03-12';

const token = import.meta.env.PUBLIC_SANITY_READ_TOKEN || import.meta.env.SANITY_READ_TOKEN;

const client =
  projectId && dataset
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: true,
        token
      })
    : null;

const heroQuery = groq`*[_type == "homeHero" && _id == "homeHeroSingleton"][0]{
  headline,
  subline,
  heroImages[]{
    "src": asset->url,
    alt
  }
}`;

const galleryQuery = groq`*[_type == "galleryImage"] | order(coalesce(priority, 999999) asc, _createdAt desc){
  _id,
  "src": image.asset->url,
  alt,
  location,
  homepageFeatured
}`;

const journalListingQuery = groq`*[_type == "journalPost"] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  excerpt,
  readingTime,
  publishedAt,
  categories,
  coverImage{
    "url": asset->url,
    alt
  }
}`;

const journalDetailQuery = groq`*[_type == "journalPost" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  readingTime,
  publishedAt,
  categories,
  coverImage{
    "url": asset->url,
    alt
  },
  body[]{
    ...,
    _type == "image" => {
      ...,
      "asset": {
        "url": asset->url
      }
    }
  }
}`;

const fallbackHeroImages: HeroImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=80',
    alt: 'Paar bei goldenem Licht'
  },
  {
    src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80',
    alt: 'Freunde stoßen auf das Paar an'
  },
  {
    src: 'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1600&q=80',
    alt: 'Paar Hand in Hand'
  },
  {
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    alt: 'Detailaufnahme eines Bouquets'
  }
];

const fallbackJournalPosts: JournalPost[] = [
  {
    _id: 'fallback-1',
    title: 'Intime Trauung im Weinberg',
    slug: 'intime-trauung-im-weinberg',
    excerpt:
      'Ein Paarshooting im Weinberg mit warmem Abendlicht und wie ihr das Beste aus einem knappen Zeitfenster zwischen Trauung und Dinner herausholt.',
    coverUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    coverAlt: 'Paar im Weinberg bei goldenem Licht',
    readingTime: '6 Min.',
    publishedAt: '2024-04-01',
    body: [
      {
        _type: 'block',
        children: [
          { _type: 'span', text: 'Dieser Beispielartikel dient als Platzhalter, bis die ersten Beiträge im Sanity Studio veröffentlicht werden.' }
        ]
      }
    ]
  },
  {
    _id: 'fallback-2',
    title: 'Timeline-Guide: Entspannt durch den Hochzeitstag',
    slug: 'timeline-guide-hochzeitstag',
    excerpt:
      'Ein strukturiertes Gerüst von Getting Ready bis Party inklusive Pufferzeiten, damit Foto- und Videoteams entspannt arbeiten können.',
    coverUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80',
    coverAlt: 'Hochzeitspaar beim Sektempfang',
    readingTime: '9 Min.',
    publishedAt: '2024-03-18',
    body: [
      {
        _type: 'block',
        children: [
          { _type: 'span', text: 'Fügt eure Inhalte im Sanity Studio hinzu, um diesen Platzhalter zu ersetzen.' }
        ]
      }
    ]
  },
  {
    _id: 'fallback-3',
    title: 'Warum ich immer mit zwei Kameras arbeite',
    slug: 'warum-zwei-kameras',
    excerpt:
      'Ein Blick in die Tasche: Objektivwahl, Backup-Strategien und wie redundante Technik eure Erinnerungen sicher macht.',
    coverUrl: 'https://images.unsplash.com/photo-1511288593934-3e58841ab0d0?auto=format&fit=crop&w=1600&q=80',
    coverAlt: 'Fotografin hält zwei Kameras in der Hand',
    readingTime: '5 Min.',
    publishedAt: '2024-02-12',
    body: [
      {
        _type: 'block',
        children: [
          { _type: 'span', text: 'Sobald ein richtiger Beitrag veröffentlicht ist, ersetzt er diesen Text automatisch.' }
        ]
      }
    ]
  }
];

export async function getHeroContent(): Promise<{
  headline?: string;
  subline?: string;
  heroImages: HeroImage[];
} | null> {
  if (!client) {
    return {
      heroImages: fallbackHeroImages
    };
  }

  try {
    const data = await client.fetch<{
      headline?: string;
      subline?: string;
      heroImages?: HeroImage[];
    } | null>(heroQuery);

    if (!data) {
      return {
        heroImages: fallbackHeroImages
      };
    }

    return {
      headline: data.headline,
      subline: data.subline,
      heroImages: (data.heroImages || fallbackHeroImages).map((image, index) => ({
        src: image?.src || fallbackHeroImages[index % fallbackHeroImages.length].src,
        alt: image?.alt || fallbackHeroImages[index % fallbackHeroImages.length].alt
      }))
    };
  } catch (error) {
    console.warn('[sanity] Hero fetch failed:', error);
    return {
      heroImages: fallbackHeroImages
    };
  }
}

export async function getGalleryImages(options: {
  homepageOnly?: boolean;
  limit?: number;
} = {}): Promise<GalleryImage[]> {
  const { homepageOnly = false, limit } = options;

  const fallback = fallbackGalleryItems.map((item, index) => ({
    ...item,
    homepageFeatured: index < 6
  }));

  if (!client) {
    return homepageOnly ? fallback.filter((item) => item.homepageFeatured).slice(0, limit ?? 6) : fallback;
  }

  try {
    const data = await client.fetch<GalleryImage[]>(galleryQuery);
    const filtered = homepageOnly ? data.filter((item) => item.homepageFeatured) : data;
    return typeof limit === 'number' ? filtered.slice(0, limit) : filtered;
  } catch (error) {
    console.warn('[sanity] Gallery fetch failed:', error);
    const filtered = homepageOnly ? fallback.filter((item) => item.homepageFeatured) : fallback;
    return typeof limit === 'number' ? filtered.slice(0, limit) : filtered;
  }
}

export async function getJournalPosts(limit?: number): Promise<JournalPost[]> {
  if (!client) {
    return typeof limit === 'number' ? fallbackJournalPosts.slice(0, limit) : fallbackJournalPosts;
  }

  try {
    const data = await client.fetch<
      {
        _id: string;
        title: string;
        slug: string;
        excerpt?: string;
        readingTime?: string;
        publishedAt?: string;
        categories?: string[];
        coverImage?: { url?: string; alt?: string };
      }[]
    >(journalListingQuery);

    const mapped = data.map((post) => ({
      _id: post._id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      readingTime: post.readingTime,
      publishedAt: post.publishedAt,
      categories: post.categories,
      coverUrl: post.coverImage?.url,
      coverAlt: post.coverImage?.alt
    }));

    return typeof limit === 'number' ? mapped.slice(0, limit) : mapped;
  } catch (error) {
    console.warn('[sanity] Journal fetch failed:', error);
    return typeof limit === 'number' ? fallbackJournalPosts.slice(0, limit) : fallbackJournalPosts;
  }
}

export async function getJournalPostBySlug(slug: string): Promise<JournalPost | null> {
  if (!slug) return null;

  if (!client) {
    return fallbackJournalPosts.find((post) => post.slug === slug) || null;
  }

  try {
    const data = await client.fetch<
      {
        _id: string;
        title: string;
        slug: string;
        excerpt?: string;
        readingTime?: string;
        publishedAt?: string;
        categories?: string[];
        coverImage?: { url?: string; alt?: string };
        body?: PortableTextBlock[];
      } | null
    >(journalDetailQuery, { slug });

    if (!data) {
      return null;
    }

    return {
      _id: data._id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || '',
      readingTime: data.readingTime,
      publishedAt: data.publishedAt,
      categories: data.categories,
      coverUrl: data.coverImage?.url,
      coverAlt: data.coverImage?.alt,
      body: data.body
    };
  } catch (error) {
    console.warn('[sanity] Journal detail fetch failed:', error);
    return fallbackJournalPosts.find((post) => post.slug === slug) || null;
  }
}
