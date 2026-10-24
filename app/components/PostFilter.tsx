'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
}

interface Post {
  id: string
  title: string
  slug: string
  summary: string | null
  week_number: number
  created_at: string
  categories: Category | null
}

interface PostFilterProps {
  categories: Category[]
  posts: Post[]
}

export default function PostFilter({ categories, posts }: PostFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.categories?.id === selectedCategory)
    : posts

  return (
    <div className="flex flex-col gap-6">
      {/* Category badges */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className="px-3 py-1.5 rounded-lg font-mono text-xs border transition cursor-pointer"
          style={
            selectedCategory === null
              ? { background: 'var(--accent)', color: '#0c0e14', borderColor: 'var(--accent)', fontWeight: 700 }
              : { background: 'var(--accent-dim)', color: 'var(--accent)', borderColor: 'var(--accent-glow)' }
          }
        >
          Sve ({posts.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className="px-3 py-1.5 rounded-lg font-mono text-xs border transition cursor-pointer"
            style={
              selectedCategory === cat.id
                ? { background: 'var(--accent)', color: '#0c0e14', borderColor: 'var(--accent)', fontWeight: 700 }
                : { background: 'var(--bg-elevated)', color: 'var(--text-secondary)', borderColor: 'var(--border-default)' }
            }
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts && filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="group card-lift p-5 rounded-xl flex flex-col justify-between gap-4"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-mono px-2.5 py-1 rounded-md"
                    style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-glow)' }}
                  >
                    Sedmica {post.week_number}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                    {post.categories?.name}
                  </span>
                </div>
                <h3 className="text-base font-bold transition" style={{ color: 'var(--text-primary)' }}>
                  {post.title}
                </h3>
                {post.summary && (
                  <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {post.summary}
                  </p>
                )}
              </div>

              <div
                className="flex items-center justify-between pt-3 border-t font-mono text-[11px]"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
              >
                <span>{new Date(post.created_at).toLocaleDateString('bs-BA')}</span>
                <span className="flex items-center gap-1 transition group-hover:gap-2" style={{ color: 'var(--accent)' }}>
                  Pročitaj lekciju
                  <span className="material-symbols-outlined text-[13px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div
            className="col-span-full py-16 text-center rounded-xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
          >
            <p className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
              Trenutno nema objavljenih lekcija za izabranu kategoriju.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
