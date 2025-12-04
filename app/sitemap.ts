import { MetadataRoute } from 'next';
import { locales } from '@/i18n';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://speed-read-gamma.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [''];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate sitemap entries for each locale
  for (const locale of locales) {
    for (const route of routes) {
      const url = locale === 'en' 
        ? `${baseUrl}${route || '/'}` 
        : `${baseUrl}/${locale}${route || ''}`;
      
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [
              loc,
              loc === 'en' 
                ? `${baseUrl}${route || '/'}` 
                : `${baseUrl}/${loc}${route || ''}`
            ])
          ),
        },
      });
    }
  }

  return sitemapEntries;
}

