export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-11-14'

// This site's published dataset is public. These public defaults also let a
// fresh deployment render the journal without a server credential.
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '1bjuvz0g'
