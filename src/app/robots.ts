import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/guest/dashboard'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
