import { MetadataRoute } from 'next';
import { getAllStyleSlugs } from '@/lib/seo-styles';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://fontgen.ai';

export default function sitemap(): MetadataRoute.Sitemap {
  const stylePages = getAllStyleSlugs().map((slug) => ({
    url: `${BASE_URL}/ai-${slug}-font-generator`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/create`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...stylePages,
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];
}
