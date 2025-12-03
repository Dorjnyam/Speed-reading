'use client';

import { useLocale } from 'next-intl';

export function StructuredData() {
  const locale = useLocale();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://speedreader.app';
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Speed Reader',
    description: locale === 'en' 
      ? 'Read faster, comprehend better with RSVP speed reading technique'
      : 'RSVP техник ашиглан хурдан унш, илүү сайн ойлго',
    url: `${baseUrl}/${locale === 'en' ? '' : locale}`,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: [
      'Speed Reading',
      'RSVP Technique',
      'PDF Reader',
      'DOCX Reader',
      'Text Reader',
      'Multi-language Support'
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

