import { ExternalLink, FileText, PenLine, Pin } from 'lucide-react'
import Link from 'next/link'
import { getAllDbPosts } from '@/lib/source/db-posts'
import { DeleteButton } from './_components/delete-button'
import { DiscordButton } from './_components/discord-button'
import { PinButton } from './_components/pin-button'

export default async function AdminPage() {
  const posts = await getAllDbPosts()

  const published = posts.filter((p) => p.published)
  const drafts = posts.filter((p) => !p.published)
  const pinned = posts.filter((p) => p.isPinned)

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-bold text-2xl'>Tableau de bord</h1>
          <p className='mt-1 text-muted-foreground text-sm'>
            Gérez vos articles de blog
          </p>
        </div>
        <Link
          className='inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm font-medium transition-opacity hover:opacity-90'
          href='/admin/posts/new'
        >
          <PenLine className='size-4' />
          Nouveau post
        </Link>
      </div>

      <div className='grid grid-cols-3 gap-4'>
        {[
          { label: 'Total', value: posts.length, icon: FileText },
          { label: 'Publiés', value: published.length, icon: ExternalLink },
          { label: 'Épinglés', value: pinned.length, icon: Pin },
        ].map(({ label, value, icon: Icon }) => (
          <div
            className='rounded-lg border border-dashed border-border bg-card/50 p-4'
            key={label}
          >
            <div className='flex items-center gap-2 text-muted-foreground text-sm'>
              <Icon className='size-4' />
              {label}
            </div>
            <p className='mt-1 font-bold text-2xl'>{value}</p>
          </div>
        ))}
      </div>

      <div className='rounded-lg border border-dashed border-border'>
        <div className='border-b border-dashed border-border px-4 py-3'>
          <h2 className='font-semibold text-sm'>Tous les posts ({posts.length})</h2>
        </div>

        {posts.length === 0 ? (
          <div className='px-4 py-12 text-center text-muted-foreground text-sm'>
            Aucun post pour l&apos;instant.{' '}
            <Link className='text-primary underline' href='/admin/posts/new'>
              Créez votre premier post
            </Link>
            .
          </div>
        ) : (
          <div className='divide-y divide-dashed divide-border'>
            {posts.map((post) => (
              <div className='flex items-center justify-between gap-4 px-4 py-3' key={post.id}>
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center gap-2'>
                    {post.isPinned && <Pin className='size-3 shrink-0 text-amber-500' />}
                    <span className='truncate font-medium text-sm'>{post.title}</span>
                    {!post.published && (
                      <span className='shrink-0 rounded bg-muted px-1.5 py-0.5 text-muted-foreground text-xs'>
                        Brouillon
                      </span>
                    )}
                  </div>
                  <div className='mt-0.5 flex items-center gap-3 text-muted-foreground text-xs'>
                    <span>{post.authorName}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString('fr-FR')}</span>
                    {post.tags && post.tags.length > 0 && (
                      <span className='flex gap-1'>
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            className='rounded bg-muted px-1 py-0.5'
                            key={tag}
                          >
                            {tag}
                          </span>
                        ))}
                      </span>
                    )}
                    {post.discordNotifiedAt && (
                      <span className='text-[#5865F2]'>
                        Discord ✓{' '}
                        {new Date(post.discordNotifiedAt).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                </div>

                <div className='flex shrink-0 items-center gap-2'>
                  <DiscordButton id={post.id} />
                  <PinButton id={post.id} isPinned={post.isPinned} />
                  <Link
                    className='inline-flex items-center gap-1 rounded border border-dashed border-border px-2 py-1 text-xs transition-colors hover:bg-accent'
                    href={`/admin/posts/${post.id}/edit`}
                  >
                    <PenLine className='size-3' />
                    Modifier
                  </Link>
                  {post.published && (
                    <Link
                      className='inline-flex items-center gap-1 rounded border border-dashed border-border px-2 py-1 text-xs transition-colors hover:bg-accent'
                      href={`/posts/${post.slug}`}
                      target='_blank'
                    >
                      <ExternalLink className='size-3' />
                      Voir
                    </Link>
                  )}
                  <DeleteButton id={post.id} title={post.title} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {drafts.length > 0 && (
        <p className='text-center text-muted-foreground text-sm'>
          {drafts.length} brouillon{drafts.length > 1 ? 's' : ''} non publié
          {drafts.length > 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
