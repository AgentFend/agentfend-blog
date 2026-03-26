import Link from 'next/link'
import { createPost } from '../../_actions/posts'
import { PostForm } from '../../_components/post-form'

export default function NewPostPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3'>
        <Link
          className='text-muted-foreground text-sm hover:text-foreground'
          href='/admin'
        >
          ← Tableau de bord
        </Link>
        <span className='text-muted-foreground'>/</span>
        <h1 className='font-bold text-xl'>Nouveau post</h1>
      </div>
      <PostForm action={createPost} submitLabel='Créer le post' />
    </div>
  )
}
