import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { NextRequest } from 'next/server';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: true,
  // Use cookie to remember user's explicit locale choice
  localeCookie: 'NEXT_LOCALE'
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

