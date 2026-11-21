import type {MetadataRoute} from 'next'
import {getPosts} from '@/sanity/lib/posts'

const siteUrl = 'https://keeltalentgroup.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts()
  return [
    {url: siteUrl, changeFrequency: 'monthly', priority: 1},
    {url: `${siteUrl}/blog`, changeFrequency: 'weekly', priority: 0.7},
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
