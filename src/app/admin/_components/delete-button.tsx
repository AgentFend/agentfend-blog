'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { deletePost } from '../_actions/posts'

export function DeleteButton({ id, title }: { id: number; title: string }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  if (confirming) {
    return (
      <span className='flex items-center gap-2'>
        <span className='text-sm text-muted-foreground'>Supprimer &quot;{title}&quot; ?</span>
        <button
          className='rounded bg-destructive px-2 py-1 text-destructive-foreground text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-50'
          disabled={loading}
          onClick={async () => {
            setLoading(true)
            await deletePost(id)
          }}
          type='button'
        >
          {loading ? 'Suppression...' : 'Confirmer'}
        </button>
        <button
          className='rounded border border-dashed border-border px-2 py-1 text-xs transition-colors hover:bg-accent'
          disabled={loading}
          onClick={() => setConfirming(false)}
          type='button'
        >
          Annuler
        </button>
      </span>
    )
  }

  return (
    <button
      className='inline-flex items-center gap-1 rounded border border-dashed border-border px-2 py-1 text-destructive text-xs transition-colors hover:bg-destructive/10'
      onClick={() => setConfirming(true)}
      type='button'
    >
      <Trash2 className='size-3' />
      Supprimer
    </button>
  )
}
