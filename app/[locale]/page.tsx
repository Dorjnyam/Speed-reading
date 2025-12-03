import { MainPage } from '@/components/MainPage';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://speedreader.app';
  const title = t('app.title');
  const description = t('pages.index.subtitle');
  const siteName = 'Speed Reader';
  
  return {
    title: {
      default: title,
      template: `%s | ${siteName}`
    },
    description,
    keywords: [
      'speed reading',
      'RSVP',
      'rapid serial visual presentation',
      'reading speed',
      'comprehension',
      'PDF reader',
      'DOCX reader',
      'text reader',
      'хурдан уншлага',
      'уншлагын хурд'
    ],
    authors: [{ name: 'Speed Reader Team' }],
    creator: 'Speed Reader',
    publisher: 'Speed Reader',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'mn': '/mn',
        'x-default': '/en',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: `/${locale}`,
      title,
      description,
      siteName,
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.png`],
      creator: '@speedreader',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // Add your verification codes here
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
    },
  };
}

export default function Home() {
  return <MainPage />;
}

