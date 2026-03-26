import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDbPostById } from '@/lib/source/db-posts'
import { updatePost } from '../../../_actions/posts'
import { PostForm } from '../../../_components/post-form'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getDbPostById(Number(id))

  if (!post) notFound()

  const action = async (formData: FormData) => {
    'use server'
    await updatePost(post.id, formData)
  }

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
        <h1 className='font-bold text-xl'>Modifier : {post.title}</h1>
      </div>
      <PostForm action={action} post={post} submitLabel='Enregistrer les modifications' />
    </div>
  )
}
