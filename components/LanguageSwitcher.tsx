'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales, defaultLocale } from '@/i18n';

const localeNames: Record<string, string> = {
  en: 'English',
  mn: 'Монгол'
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Get current pathname
    const currentPath = pathname;
    
    // Remove current locale prefix if exists
    let pathWithoutLocale = currentPath;
    
    // Check each locale and remove if found
    for (const loc of locales) {
      const localePrefix = `/${loc}`;
      // Exact match: /mn -> /
      if (pathWithoutLocale === localePrefix) {
        pathWithoutLocale = '/';
        break;
      }
      // Starts with locale: /mn/... -> /...
      if (pathWithoutLocale.startsWith(`${localePrefix}/`)) {
        pathWithoutLocale = pathWithoutLocale.slice(localePrefix.length);
        break;
      }
    }
    
    // Ensure path starts with /
    if (!pathWithoutLocale || pathWithoutLocale === '') {
      pathWithoutLocale = '/';
    }
    if (!pathWithoutLocale.startsWith('/')) {
      pathWithoutLocale = '/' + pathWithoutLocale;
    }
    
    // Build new path with new locale
    let newPath: string;
    if (newLocale === defaultLocale) {
      // Default locale (en) - no prefix
      newPath = pathWithoutLocale;
    } else {
      // Non-default locale (mn) - add prefix
      if (pathWithoutLocale === '/') {
        newPath = `/${newLocale}`;
      } else {
        newPath = `/${newLocale}${pathWithoutLocale}`;
      }
    }
    
    // Navigate to new path
    router.replace(newPath);
  };

  return (
    <div className="flex items-center space-x-2">
      {locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            locale === loc
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {localeNames[loc]}
        </button>
      ))}
    </div>
  );
}

