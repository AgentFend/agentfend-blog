'use client'

import { BellRing, CheckCircle, XCircle } from 'lucide-react'
import { useState } from 'react'
import { resendDiscordNotification } from '../_actions/posts'

export function DiscordButton({ id }: { id: number }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  return (
    <button
      className='inline-flex items-center gap-1 rounded border border-dashed border-[#5865F2]/60 px-2 py-1 text-[#5865F2] text-xs transition-colors hover:bg-[#5865F2]/10 disabled:opacity-50'
      disabled={status === 'loading'}
      onClick={async () => {
        setStatus('loading')
        const ok = await resendDiscordNotification(id)
        setStatus(ok ? 'ok' : 'error')
        setTimeout(() => setStatus('idle'), 3000)
      }}
      type='button'
    >
      {status === 'loading' && <BellRing className='size-3 animate-pulse' />}
      {status === 'ok' && <CheckCircle className='size-3' />}
      {status === 'error' && <XCircle className='size-3' />}
      {status === 'idle' && <BellRing className='size-3' />}
      {status === 'loading'
        ? 'Envoi...'
        : status === 'ok'
          ? 'Envoyé !'
          : status === 'error'
            ? 'Erreur'
            : 'Discord'}
    </button>
  )
}
