import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required().max(110),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: 'A short summary used on the blog index and in search results.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        })
      ]
    }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'category'}})],
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'Search & social preview',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'title', title: 'SEO title', type: 'string', validation: (rule) => rule.max(60)}),
        defineField({name: 'description', title: 'Meta description', type: 'text', rows: 3, validation: (rule) => rule.max(160)}),
      ],
    }),
    defineField({
      name: 'seoGenie',
      title: 'SEO Genie editorial notes',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'topicKey', type: 'string', readOnly: true}),
        defineField({name: 'primaryQuery', type: 'string', readOnly: true}),
        defineField({name: 'brandId', type: 'string', readOnly: true}),
        defineField({name: 'sourceNotes', type: 'array', of: [defineArrayMember({type: 'text'})], readOnly: true}),
        defineField({name: 'reviewFlags', type: 'array', of: [defineArrayMember({type: 'text'})], readOnly: true}),
        defineField({name: 'generatedAt', type: 'datetime', readOnly: true}),
        defineField({name: 'contentHash', type: 'string', readOnly: true}),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})
