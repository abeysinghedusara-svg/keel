import {defineQuery} from 'next-sanity'
import {serverClient} from './serverClient'

export const postsQuery = defineQuery(`*[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "author": author->name,
  "categories": categories[]->title,
  "image": mainImage.asset->url,
  "imageAlt": mainImage.alt,
  "seoTitle": seo.title,
  "seoDescription": seo.description
}`)

export const postQuery = defineQuery(`*[_type == "post" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "author": author->name,
  "categories": categories[]->title,
  "image": mainImage.asset->url,
  "imageAlt": mainImage.alt,
  "seoTitle": seo.title,
  "seoDescription": seo.description,
  body
}`)

export type BlogPost = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt: string
  author?: string
  categories?: string[]
  image?: string
  imageAlt?: string
  seoTitle?: string
  seoDescription?: string
  body?: Array<Record<string, unknown>>
}

const publishedOptions = {
  perspective: 'published' as const,
  stega: false as const,
  next: {revalidate: 300},
}

export async function getPosts(): Promise<BlogPost[]> {
  try {
    return await serverClient.fetch<BlogPost[]>(postsQuery, {}, publishedOptions)
  } catch {
    // Sanity error objects may include Authorization request headers.
    console.error('Could not load published Sanity posts. Check CMS connectivity and server credentials.')
    return []
  }
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    return await serverClient.fetch<BlogPost | null>(postQuery, {slug}, publishedOptions)
  } catch {
    console.error('Could not load Sanity post. Check CMS connectivity and server credentials.')
    return null
  }
}
