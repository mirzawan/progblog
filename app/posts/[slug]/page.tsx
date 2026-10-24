import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { revalidatePath } from 'next/cache'

// Server Action za slanje komentara sa revalidacijom rute
async function handleAddComment(postId: string, slug: string, formData: FormData) {
  'use server'
  const author_name = formData.get('author_name') as string
  const content = formData.get('content') as string

  if (!author_name || !content) return

  await supabase.from('comments').insert({
    post_id: postId,
    author_name,
    content,
  })

  revalidatePath(`/posts/${slug}`)
}

// Unutrašnja komponenta koja čeka params i učitava lekciju i komentare unutar Suspense-a
async function PostContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: post } = await supabase
    .from('posts')
    .select('*, categories(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) {
    notFound()
  }

  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', post.id)
    .order('created_at', { ascending: true })

  const addCommentAction = handleAddComment.bind(null, post.id, slug)

  return (
    <>
      {/* Meta Header */}
      <div className="pb-6 mb-8 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-3 font-mono text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
          <span
            className="px-2.5 py-0.5 rounded"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }}
          >
            {post.categories?.name || 'Opšte'}
          </span>
          <span>•</span>
          <span>{new Date(post.created_at).toLocaleDateString('bs-BA')}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-snug" style={{ color: 'var(--text-primary)' }}>
          {post.title}
        </h1>
        {post.summary && (
          <p className="text-base mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {post.summary}
          </p>
        )}
      </div>

      {/* Lesson content */}
      <article
        className="tiptap-content prose prose-invert max-w-none text-sm leading-relaxed"
        style={{ color: 'var(--text-primary)' }}
      >
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      {/* Comments Section */}
      <section className="mt-16 pt-10 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-semibold font-mono flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <span className="material-symbols-outlined text-[19px]" style={{ color: 'var(--accent)' }}>chat_bubble_outline</span>
            Komentari ({comments?.length || 0})
          </h3>
        </div>

        {/* New comment form */}
        <form
          action={addCommentAction}
          className="rounded-xl p-5 mb-8"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
        >
          <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            Ostavi pitanje ili komentar
          </h4>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              name="author_name"
              required
              placeholder="Tvoje ime / Indeks..."
              className="px-3.5 py-2.5 rounded-lg text-sm outline-none transition"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
            <textarea
              name="content"
              required
              rows={3}
              placeholder="Napiši komentar ili pitanje za profesora..."
              className="p-3.5 rounded-lg text-sm outline-none transition resize-none"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg font-mono text-sm font-semibold transition"
                style={{ background: 'var(--accent)', color: '#0c0e14' }}
              >
                Objavi komentar
              </button>
            </div>
          </div>
        </form>

        {/* Comments list */}
        <div className="flex flex-col gap-3">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 rounded-xl"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-medium" style={{ color: 'var(--accent)' }}>
                    {comment.author_name}
                  </span>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(comment.created_at).toLocaleDateString('bs-BA')}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {comment.content}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs font-mono text-center py-4" style={{ color: 'var(--text-secondary)' }}>
              Još uvek nema komentara na ovoj lekciji. Budite prvi koji će postaviti pitanje!
            </p>
          )}
        </div>
      </section>
    </>
  )
}

export default function SinglePostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header
        className="fixed top-0 w-full z-50 backdrop-blur-xl border-b"
        style={{ background: 'rgba(12,14,20,0.85)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="h-16 px-6 max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono transition"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span className="material-symbols-outlined text-[17px]">arrow_back</span>
            Sve lekcije
          </Link>
          <div
            className="flex items-center gap-2 text-xs font-mono px-2.5 py-1 rounded-md"
            style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-glow)' }}
          >
            <span>Lekcija</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto pt-24 pb-20 px-6">
        <Suspense fallback={
          <div className="py-24 text-center font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
            Učitavanje lekcije...
          </div>
        }>
          <PostContent params={params} />
        </Suspense>
      </main>
    </div>
  )
}
