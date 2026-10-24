import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import TiptapEditorWrapper from './TiptapEditorWrapper'

// Server Action za dodavanje nove lekcije
async function handleCreatePost(formData: FormData) {
  'use server'

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const summary = formData.get('summary') as string
  const content = formData.get('content') as string
  const week_number = Number(formData.get('week_number'))
  const category_id = formData.get('category_id') as string

  if (!title || !slug || !content) return

  await supabase.from('posts').insert({
    title,
    slug,
    summary,
    content,
    week_number,
    category_id,
    is_published: true,
  })

  revalidatePath('/')
  revalidatePath('/admin')
}

// Server Action za dodavanje nove kategorije
async function handleCreateCategory(formData: FormData) {
  'use server'

  const name = formData.get('cat_name') as string
  const slug = formData.get('cat_slug') as string

  if (!name || !slug) return

  const { error } = await supabase.from('categories').insert({ name, slug })

  if (error) {
    console.error('Greška pri dodavanju kategorije:', error.message)
    return
  }

  revalidatePath('/admin')
  revalidatePath('/')
}

// Server Action za brisanje lekcije
async function handleDeletePost(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  if (!id) return

  await supabase.from('posts').delete().eq('id', id)
  revalidatePath('/')
  revalidatePath('/admin')
}

// Komponenta koja provjerava kolačiće i učitava podatke iz baze
async function AdminContent() {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get('isAdmin')?.value

  if (!isAdmin) {
    redirect('/admin/login')
  }

  const { data: categories } = await supabase.from('categories').select('*')
  const { data: posts } = await supabase
    .from('posts')
    .select('*, categories(*)')
    .order('week_number', { ascending: true })

  return (
    <div className="w-full max-w-7xl mx-auto pt-24 pb-20 px-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

      {/* ── LEFT: New post form (7 cols) ── */}
      <div
        className="lg:col-span-7 rounded-2xl p-6 h-fit flex flex-col gap-5"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
      >
        {/* Panel header */}
        <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-glow)' }}
          >
            <span className="material-symbols-outlined text-[17px]" style={{ color: 'var(--accent)' }}>post_add</span>
          </div>
          <div>
            <h2 className="text-sm font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>Nova lekcija</h2>
            <p className="text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>Popunite formu i objavite lekciju</p>
          </div>
        </div>

        <form action={handleCreatePost} className="flex flex-col gap-4">
          {/* Title + Slug row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>Naslov lekcije</label>
              <input
                type="text"
                name="title"
                required
                placeholder="Npr. Uvod u pokazivače u C++"
                className="admin-input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>Slug (URL putanja)</label>
              <input
                type="text"
                name="slug"
                required
                placeholder="uvod-u-pokazivace"
                className="admin-input font-mono"
              />
            </div>
          </div>

          {/* Week + Category row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>Sedmica nastave</label>
              <input
                type="number"
                name="week_number"
                defaultValue={1}
                required
                className="admin-input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>Kategorija</label>
              <select name="category_id" required className="admin-select">
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>Kratak opis (Summary)</label>
            <textarea
              name="summary"
              rows={2}
              placeholder="Kratak pregled lekcije za karticu na početnoj..."
              className="admin-input resize-none"
            />
          </div>

          {/* Rich Text Editor */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>Sadržaj (Rich Text Editor)</label>
              <span className="font-mono text-[10px]" style={{ color: 'var(--accent)' }}>H1, H2, Bold, Italic, Code & Slike</span>
            </div>
            <TiptapEditorWrapper />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-1 w-full py-3 rounded-xl font-mono text-sm font-bold transition"
            style={{ background: 'var(--accent)', color: '#0c0e14' }}
          >
            Objavi lekciju →
          </button>
        </form>
      </div>

      {/* ── RIGHT: Category management + post list (5 cols) ── */}
      <div className="lg:col-span-5 flex flex-col gap-5">

        {/* New category */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-3 mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}
            >
              <span className="material-symbols-outlined text-[15px]" style={{ color: '#a78bfa' }}>category</span>
            </div>
            <h2 className="text-sm font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>Nova kategorija</h2>
          </div>
          <form action={handleCreateCategory} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                name="cat_name"
                required
                placeholder="Naziv (npr. Python)"
                className="admin-input"
              />
              <input
                type="text"
                name="cat_slug"
                required
                placeholder="Slug (npr. python)"
                className="admin-input font-mono"
              />
            </div>
            <button
              type="submit"
              className="py-2 rounded-lg font-mono text-xs font-semibold transition"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
              }}
            >
              + Dodaj kategoriju
            </button>
          </form>
        </div>

        {/* Published posts list */}
        <div
          className="rounded-2xl p-5 flex-1"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[17px]" style={{ color: 'var(--accent)' }}>article</span>
              <h2 className="text-sm font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>Objavljene lekcije</h2>
            </div>
            <span
              className="text-[11px] font-mono px-2.5 py-1 rounded-full"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-glow)' }}
            >
              {posts?.length || 0} ukupno
            </span>
          </div>

          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="p-3.5 rounded-xl flex items-center justify-between gap-3"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                >
                  <div className="flex flex-col overflow-hidden gap-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded shrink-0"
                        style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                      >
                        S.{post.week_number}
                      </span>
                      <span className="text-[10px] font-mono truncate" style={{ color: 'var(--text-secondary)' }}>
                        {post.categories?.name}
                      </span>
                    </div>
                    <h3 className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {post.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/posts/${post.slug}`}
                      target="_blank"
                      title="Pregled lekcije"
                      className="p-2 rounded-lg transition"
                      style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                    >
                      <span className="material-symbols-outlined text-[15px]">visibility</span>
                    </Link>
                    <form action={handleDeletePost}>
                      <input type="hidden" name="id" value={post.id} />
                      <button
                        type="submit"
                        title="Obriši lekciju"
                        className="p-2 rounded-lg transition"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}
                      >
                        <span className="material-symbols-outlined text-[15px]">delete</span>
                      </button>
                    </form>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs font-mono text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                Nema unesenih lekcija.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* ── Admin Header ── */}
      <header
        className="fixed top-0 w-full z-50 backdrop-blur-xl border-b"
        style={{ background: 'rgba(12,14,20,0.9)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="h-16 px-6 max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-glow)' }}
            >
              <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--accent)' }}>admin_panel_settings</span>
            </div>
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Admin <span style={{ color: 'var(--accent)' }}>Dashboard</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-mono text-xs transition flex items-center gap-1.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span className="material-symbols-outlined text-[15px]">arrow_back</span>
              Glavna stranica
            </Link>
            <form action={async () => {
              'use server'
              const cookieStore = await cookies()
              cookieStore.delete('isAdmin')
              redirect('/admin/login')
            }}>
              <button type="submit" className="font-mono text-xs transition" style={{ color: '#f87171' }}>
                Odjava
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Admin Content sa Suspense granicom */}
      <Suspense fallback={
        <div className="py-24 text-center font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
          Učitavanje admin panela...
        </div>
      }>
        <AdminContent />
      </Suspense>
    </div>
  )
}
