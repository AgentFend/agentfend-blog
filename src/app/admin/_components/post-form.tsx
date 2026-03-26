'use client'

import { ImageIcon, Loader2, Tag, X } from 'lucide-react'
import { useState } from 'react'
import type { DbPost } from '@/lib/source/db-posts'

interface PostFormProps {
  post?: DbPost
  action: (formData: FormData) => Promise<void>
  submitLabel: string
}

export function PostForm({ post, action, submitLabel }: PostFormProps) {
  const [tags, setTags] = useState<string[]>(post?.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [published, setPublished] = useState(post?.published ?? true)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(false)

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) {
      setTags([...tags, t])
    }
    setTagInput('')
  }

  return (
    <form
      action={async (fd) => {
        setLoading(true)
        fd.set('tags', tags.join(','))
        fd.set('published', String(published))
        await action(fd)
        setLoading(false)
      }}
      className='space-y-6'
    >
      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          <div className='space-y-2'>
            <label className='font-medium text-sm' htmlFor='title'>
              Titre *
            </label>
            <input
              className='w-full rounded-md border border-dashed border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary'
              defaultValue={post?.title}
              id='title'
              name='title'
              placeholder='Titre de votre article...'
              required
            />
          </div>

          <div className='space-y-2'>
            <label className='font-medium text-sm' htmlFor='description'>
              Description
            </label>
            <textarea
              className='w-full resize-none rounded-md border border-dashed border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary'
              defaultValue={post?.description ?? ''}
              id='description'
              name='description'
              placeholder='Courte description de l&apos;article...'
              rows={3}
            />
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <label className='font-medium text-sm' htmlFor='content'>
                Contenu (Markdown) *
              </label>
              <button
                className='text-muted-foreground text-xs underline hover:text-foreground'
                onClick={() => setPreview(!preview)}
                type='button'
              >
                {preview ? 'Éditer' : 'Aperçu'}
              </button>
            </div>
            <textarea
              className='w-full resize-y rounded-md border border-dashed border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary'
              defaultValue={post?.content}
              id='content'
              name='content'
              placeholder='Écrivez votre article en Markdown...&#10;&#10;## Introduction&#10;&#10;Votre contenu ici...'
              required
              rows={20}
            />
          </div>
        </div>

        <div className='space-y-6'>
          <div className='rounded-lg border border-dashed border-border p-4 space-y-4'>
            <h3 className='font-semibold text-sm'>Paramètres</h3>

            <div className='flex items-center justify-between'>
              <label className='font-medium text-sm' htmlFor='published-toggle'>
                Publié
              </label>
              <button
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  published ? 'bg-primary' : 'bg-muted'
                }`}
                id='published-toggle'
                onClick={() => setPublished(!published)}
                type='button'
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    published ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className='space-y-2'>
              <label className='font-medium text-sm'>
                <span className='flex items-center gap-1'>
                  <ImageIcon className='size-3' />
                  Image de couverture (URL)
                </span>
              </label>
              <input
                className='w-full rounded-md border border-dashed border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary'
                defaultValue={post?.image ?? ''}
                name='image'
                placeholder='https://...'
                type='url'
              />
            </div>

            <div className='space-y-2'>
              <label className='font-medium text-sm'>
                <span className='flex items-center gap-1'>
                  <Tag className='size-3' />
                  Tags
                </span>
              </label>
              <div className='flex gap-2'>
                <input
                  className='min-w-0 flex-1 rounded-md border border-dashed border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder='Ajouter un tag...'
                  value={tagInput}
                />
                <button
                  className='rounded-md border border-dashed border-border px-3 py-2 text-sm transition-colors hover:bg-accent'
                  onClick={addTag}
                  type='button'
                >
                  +
                </button>
              </div>
              {tags.length > 0 && (
                <div className='flex flex-wrap gap-1.5'>
                  {tags.map((tag) => (
                    <span
                      className='flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs'
                      key={tag}
                    >
                      {tag}
                      <button
                        className='text-muted-foreground hover:text-foreground'
                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                        type='button'
                      >
                        <X className='size-3' />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            className='flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-primary-foreground text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50'
            disabled={loading}
            type='submit'
          >
            {loading && <Loader2 className='size-4 animate-spin' />}
            {loading ? 'Enregistrement...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  )
}
