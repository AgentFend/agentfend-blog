'use client'

import { Pin, PinOff } from 'lucide-react'
import { useState } from 'react'
import { togglePin } from '../_actions/posts'

export function PinButton({ id, isPinned }: { id: number; isPinned: boolean }) {
  const [loading, setLoading] = useState(false)
  const [pinned, setPinned] = useState(isPinned)

  return (
    <button
      className={`inline-flex items-center gap-1 rounded border border-dashed px-2 py-1 text-xs transition-colors ${
        pinned
          ? 'border-amber-400 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950'
          : 'border-border text-muted-foreground hover:bg-accent'
      }`}
      disabled={loading}
      onClick={async () => {
        setLoading(true)
        await togglePin(id, pinned)
        setPinned(!pinned)
        setLoading(false)
      }}
      type='button'
    >
      {pinned ? <Pin className='size-3' /> : <PinOff className='size-3' />}
      {pinned ? 'Épinglé' : 'Épingler'}
    </button>
  )
}
