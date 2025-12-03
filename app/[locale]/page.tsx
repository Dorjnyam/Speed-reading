import { MainPage } from '@/components/MainPage';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations();
  
  return {
    title: t('app.title'),
    description: t('pages.index.subtitle'),
  };
}

export default function Home() {
  return <MainPage />;
}

