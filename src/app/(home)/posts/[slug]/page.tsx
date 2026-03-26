import { File, Files, Folder } from 'fumadocs-ui/components/files'
import { InlineTOC } from 'fumadocs-ui/components/inline-toc'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogProgressBar from '@/components/blog/progress-bar'
import { PostJsonLd } from '@/components/json-ld'
import { Section } from '@/components/section'
import { description as homeDescription } from '@/constants/site'
import { createMetadata, getBlogPageImage } from '@/lib/metadata'
import { markdownToHtml } from '@/lib/markdown'
import { getDbPost } from '@/lib/source/db-posts'
import { getPost, getPosts } from '@/lib/source'
import { TagCard } from '@/components/tags/tag-card'
import { Header } from './_components/header'
import { PostComments, Share } from './page.client'

export const dynamicParams = true

export default async function Page(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params

  // Try MDX post first
  const mdxPage = getPost([params.slug])
  if (mdxPage) {
    const { body: Mdx, toc, tags, lastModified } = mdxPage.data
    const lastUpdate = lastModified ? new Date(lastModified) : undefined

    return (
      <>
        <BlogProgressBar />
        <Header page={mdxPage} tags={tags} />
        <Section className='h-full' sectionClassName='flex flex-1'>
          <article className='flex min-h-full flex-col lg:flex-row'>
            <div className='flex flex-1 flex-col gap-4'>
              {toc?.length ? (
                <InlineTOC
                  className='rounded-none border-0 border-border border-b border-dashed'
                  items={toc}
                />
              ) : (
                <div />
              )}
              <div className='prose min-w-0 flex-1 px-4'>
                <Mdx
                  components={{
                    ...defaultMdxComponents,
                    File,
                    Files,
                    Folder,
                    Tabs,
                    Tab,
                  }}
                />
              </div>
              <PostComments
                className='[&_form>div]:!rounded-none rounded-none border-0 border-border border-t border-dashed'
                slug={params.slug}
              />
            </div>
            <div className='flex flex-col gap-4 p-4 text-sm lg:sticky lg:top-[4rem] lg:h-[calc(100vh-4rem)] lg:w-[250px] lg:self-start lg:overflow-y-auto lg:border-border lg:border-l lg:border-dashed'>
              <div>
                <p className='mb-1 text-fd-muted-foreground'>Written by</p>
                <p className='font-medium'>{mdxPage.data.author ?? 'Unknown'}</p>
              </div>
              <div>
                <p className='mb-1 text-fd-muted-foreground text-sm'>Created At</p>
                <p className='font-medium'>{new Date(mdxPage.data.date).toDateString()}</p>
              </div>
              {lastUpdate && (
                <div>
                  <p className='mb-1 text-fd-muted-foreground text-sm'>Updated At</p>
                  <p className='font-medium'>{lastUpdate.toDateString()}</p>
                </div>
              )}
              <Share url={mdxPage.url} />
            </div>
          </article>
        </Section>
        <PostJsonLd page={mdxPage} />
      </>
    )
  }

  // Try DB post
  const dbPost = await getDbPost(params.slug)
  if (!dbPost || !dbPost.published) notFound()

  const htmlContent = await markdownToHtml(dbPost.content)

  return (
    <>
      <BlogProgressBar />
      <Section>
        <div className='relative h-[350px] overflow-clip md:h-[500px]'>
          <div className='relative flex h-full w-full flex-col justify-end overflow-hidden rounded-2xl bg-primary/80 shadow-xl'>
            {dbPost.image && (
              <img
                alt={dbPost.title}
                className='absolute inset-0 h-full w-full rounded-2xl object-cover'
                src={dbPost.image}
              />
            )}
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent' />
            <div className='relative z-10 mt-auto p-8 md:p-16'>
              {dbPost.tags && dbPost.tags.length > 0 && (
                <div className='mb-4 hidden gap-2 md:flex md:flex-wrap'>
                  {dbPost.tags.map((tag) => (
                    <TagCard
                      className='border border-white/60 bg-white/10 text-white hover:bg-white/20 [&_span]:text-white [&_svg]:text-white/70'
                      key={tag}
                      name={tag}
                    />
                  ))}
                </div>
              )}
              <h1 className='max-w-2xl font-medium text-4xl text-white leading-[45px] tracking-tight md:text-5xl md:leading-[60px]'>
                {dbPost.title}
              </h1>
              {dbPost.description && (
                <p className='mt-4 hidden max-w-3xl text-slate-100 leading-8 md:block'>
                  {dbPost.description}
                </p>
              )}
              <p className='mt-4 text-slate-200 text-xs'>
                {new Date(dbPost.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className='h-full' sectionClassName='flex flex-1'>
        <article className='flex min-h-full flex-col lg:flex-row'>
          <div className='flex flex-1 flex-col gap-4'>
            <div
              className='prose dark:prose-invert min-w-0 max-w-none flex-1 px-4 py-6'
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
            <PostComments
              className='[&_form>div]:!rounded-none rounded-none border-0 border-border border-t border-dashed'
              slug={params.slug}
            />
          </div>
          <div className='flex flex-col gap-4 p-4 text-sm lg:sticky lg:top-[4rem] lg:h-[calc(100vh-4rem)] lg:w-[250px] lg:self-start lg:overflow-y-auto lg:border-border lg:border-l lg:border-dashed'>
            <div>
              <p className='mb-1 text-fd-muted-foreground'>Written by</p>
              <p className='font-medium'>{dbPost.authorName}</p>
            </div>
            <div>
              <p className='mb-1 text-fd-muted-foreground text-sm'>Created At</p>
              <p className='font-medium'>{new Date(dbPost.createdAt).toDateString()}</p>
            </div>
            <Share url={`/posts/${dbPost.slug}`} />
          </div>
        </article>
      </Section>
    </>
  )
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const params = await props.params

  const mdxPage = getPost([params.slug])
  if (mdxPage) {
    const title = mdxPage.data.title ?? 'Untitled'
    const description = mdxPage.data.description ?? homeDescription
    const image = getBlogPageImage(mdxPage)
    return createMetadata({
      title,
      description,
      openGraph: { url: `/posts/${mdxPage.slugs.join('/')}`, images: image.url },
      twitter: { images: image.url },
      alternates: { canonical: mdxPage.url },
    })
  }

  const dbPost = await getDbPost(params.slug)
  if (!dbPost) notFound()

  return createMetadata({
    title: dbPost.title,
    description: dbPost.description ?? homeDescription,
    openGraph: { url: `/posts/${dbPost.slug}` },
    alternates: { canonical: `/posts/${dbPost.slug}` },
  })
}

export function generateStaticParams(): { slug: string | undefined }[] {
  return getPosts().map((page) => ({
    slug: page.slugs[0],
  }))
}
