import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo/config';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/safaris`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/experiences`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  try {
    // Dynamic Safari Packages
    const packages = await prisma.safariPackage.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true },
    });

    const packageRoutes: MetadataRoute.Sitemap = packages.map((pkg: any) => ({
      url: `${baseUrl}/safaris/${pkg.id}`,
      lastModified: pkg.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...routes, ...packageRoutes];
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
    // Fallback to static routes if DB connection fails
    return routes;
  }
}
