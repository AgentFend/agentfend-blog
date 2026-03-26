import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { getSession } from '@/server/auth'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession()

  if (!session?.user) {
    redirect('/auth/login')
  }

  if (session.user.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b border-dashed border-border bg-card/50'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4'>
          <div className='flex items-center gap-6'>
            <Link className='font-bold text-xl' href='/admin'>
              Panel Admin
            </Link>
            <nav className='flex items-center gap-4 text-sm'>
              <Link
                className='text-muted-foreground transition-colors hover:text-foreground'
                href='/admin'
              >
                Tableau de bord
              </Link>
              <Link
                className='text-muted-foreground transition-colors hover:text-foreground'
                href='/admin/posts/new'
              >
                Nouveau post
              </Link>
            </nav>
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-muted-foreground text-sm'>{session.user.name}</span>
            <Link
              className='rounded-md border border-dashed border-border px-3 py-1.5 text-sm transition-colors hover:bg-accent'
              href='/'
            >
              Voir le blog
            </Link>
          </div>
        </div>
      </header>
      <main className='mx-auto max-w-7xl px-6 py-8'>{children}</main>
    </div>
  )
}
