import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import PostFilter from './components/PostFilter'

// Unutrašnja komponenta koja učitava podatke i prikazuje stranicu unutar Suspense-a
async function HomeContent() {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get('isAdmin')?.value

  // Dohvati kategorije i postove iz baze
  const { data: categories } = await supabase.from('categories').select('*')
  const { data: posts } = await supabase
    .from('posts')
    .select('*, categories(*)')
    .order('week_number', { ascending: true })

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* ── Navbar ── */}
      <header
        className="fixed top-0 w-full z-50 backdrop-blur-xl border-b"
        style={{
          background: 'rgba(12,14,20,0.85)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="h-16 px-6 max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-black font-mono"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-glow)' }}
            >
              &gt;_
            </div>
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              prog<span style={{ color: 'var(--accent)' }}>blog</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/admin"
                  className="px-3 py-1.5 rounded-lg font-mono text-xs font-semibold border transition flex items-center gap-1.5"
                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)', borderColor: 'var(--accent-glow)' }}
                >
                  <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
                  Admin
                </Link>
                <form action={async () => {
                  'use server'
                  const cs = await cookies()
                  cs.delete('isAdmin')
                  redirect('/')
                }}>
                  <button type="submit" className="font-mono text-xs transition" style={{ color: '#f87171' }}>
                    Odjava
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="font-mono text-xs transition flex items-center gap-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span className="material-symbols-outlined text-[15px]">lock</span>
                Prijava
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 w-full max-w-6xl mx-auto pt-28 pb-20 px-6 flex flex-col gap-14">

        {/* ── Animated Hero Section ── */}
        <section className="relative rounded-2xl overflow-hidden" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>

          {/* Animated grid background */}
          <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

          {/* Teal glow blob top-right */}
          <div
            className="glow-blob animate-glow-pulse"
            style={{
              width: '380px', height: '260px',
              background: 'radial-gradient(circle, rgba(94,234,212,0.12) 0%, transparent 70%)',
              top: '-60px', right: '-60px',
            }}
          />
          {/* Purple glow blob bottom-left */}
          <div
            className="glow-blob animate-glow-pulse delay-400"
            style={{
              width: '300px', height: '200px',
              background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)',
              bottom: '-40px', left: '-20px',
            }}
          />

          {/* Title bar */}
          <div
            className="relative px-5 py-3 flex items-center justify-between border-b"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: '#f87171', opacity: 0.8 }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#fbbf24', opacity: 0.8 }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#34d399', opacity: 0.8 }} />
              </div>
              <span className="ml-2 font-mono text-xs flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <span className="material-symbols-outlined text-[13px]" style={{ color: 'var(--accent)' }}>terminal</span>
                ~/CppJavaHub/workspace.env
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-3 font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--accent)' }}>Clang++ / OpenJDK 21</span>
              <span>•</span>
              <span style={{ color: '#34d399' }}>Status: Active ●</span>
            </div>
          </div>

          {/* Hero body */}
          <div className="relative p-8 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">

            {/* Left — Text content */}
            <div className="md:col-span-7 flex flex-col gap-5">

              {/* Namespace tag */}
              <div className="animate-fade-up flex items-center gap-2 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent-purple)' }}>namespace</span>
                <span style={{ color: 'var(--text-primary)' }}>AcademicHub</span>
                <span style={{ color: 'var(--accent)' }}>{`{`}</span>
              </div>

              {/* Headline */}
              <h1
                className="animate-fade-up delay-100 text-3xl md:text-4xl font-bold leading-tight tracking-tight cursor-blink"
                style={{ color: 'var(--text-primary)' }}
              >
                Arhitektura koda,<br />
                <span style={{ color: 'var(--accent)' }}>objektno programiranje</span><br />
                i algoritmi.
              </h1>

              {/* Comment list */}
              <div
                className="animate-fade-up delay-200 border-l-2 pl-4 flex flex-col gap-1.5 font-mono text-xs"
                style={{ borderColor: 'var(--accent-glow)', color: 'var(--text-secondary)' }}
              >
                <p><span style={{ color: '#34d399' }}>// [01]</span> Koncepti memorijskog upravljanja i pokazivača u C++</p>
                <p><span style={{ color: '#34d399' }}>// [02]</span> Nasljeđivanje, polimorfizam i generičko programiranje u Javi</p>
                <p><span style={{ color: '#34d399' }}>// [03]</span> Strukture podataka i efikasna rješenja zadataka</p>
              </div>

              {/* Description */}
              <p
                className="animate-fade-up delay-300 text-sm leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                Centralizovano akademsko okruženje prilagođeno studentima. Pratite svaku sedmicu predavanja, analizirajte izvorne kodove i učestvujte u interaktivnoj razmjeni rješenja.
              </p>

              {/* CTA buttons */}
              <div className="animate-fade-up delay-400 flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#lekcije"
                  className="px-4 py-2 rounded-lg font-mono text-sm font-semibold transition flex items-center gap-2"
                  style={{ background: 'var(--accent)', color: '#0c0e14' }}
                >
                  <span className="material-symbols-outlined text-[17px]">school</span>
                  Pregledaj lekcije
                </a>
               
              </div>

              {/* Closing brace */}
              <div className="animate-fade-up delay-500 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent)' }}>{`}`}</span> <span>// End of Workspace</span>
              </div>
            </div>

            {/* Right — Animated code snippets */}
            <div className="md:col-span-5 flex flex-col gap-4">

              {/* C++ snippet */}
              <div
                className="animate-slide-right delay-200 rounded-xl overflow-hidden animate-float"
                style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}
              >
                <div
                  className="flex items-center justify-between px-4 py-2 border-b"
                  style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                >
                  <span className="font-mono text-[11px]" style={{ color: 'var(--accent)' }}>example.cpp</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>C++20</span>
                </div>
                <div className="p-4 font-mono text-[11px] leading-relaxed space-y-1 overflow-hidden" style={{ color: 'var(--text-secondary)' }}>
                  <p><span style={{ color: 'var(--accent-purple)' }}>template</span>&lt;<span style={{ color: 'var(--accent-purple)' }}>typename</span> T&gt;</p>
                  <p><span style={{ color: 'var(--accent-purple)' }}>void</span> <span style={{ color: '#60a5fa' }}>processData</span>(T&amp; val) &#123;</p>
                  <p className="pl-4">std::cout &lt;&lt; <span style={{ color: 'var(--accent-amber)' }}>&quot;Value: &quot;</span> &lt;&lt; val;</p>
                  <p>&#125;</p>
                  <p className="pt-1">
                    <span style={{ color: 'var(--accent-purple)' }}>int</span> <span style={{ color: '#60a5fa' }}>main</span>() &#123;
                  </p>
                  <p className="pl-4"><span style={{ color: 'var(--text-muted)' }}>// smart pointer</span></p>
                  <p className="pl-4"><span style={{ color: 'var(--accent-purple)' }}>auto</span> ptr = std::make_unique&lt;<span style={{ color: '#fde68a' }}>Node</span>&gt;();</p>
                  <p>&#125;</p>
                </div>
              </div>

              {/* Java snippet */}
              <div
                className="animate-slide-right delay-400 rounded-xl overflow-hidden animate-float delay-300"
                style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}
              >
                <div
                  className="flex items-center justify-between px-4 py-2 border-b"
                  style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                >
                  <span className="font-mono text-[11px]" style={{ color: 'var(--accent-amber)' }}>Main.java</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(251,191,36,0.1)', color: 'var(--accent-amber)' }}>Java 21</span>
                </div>
                <div className="p-4 font-mono text-[11px] leading-relaxed space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <p><span style={{ color: 'var(--accent-purple)' }}>public class</span> <span style={{ color: '#fde68a' }}>Engine</span> <span style={{ color: 'var(--accent-purple)' }}>extends</span> <span style={{ color: '#fde68a' }}>Core</span> &#123;</p>
                  <p className="pl-4"><span style={{ color: 'var(--accent-purple)' }}>private final</span> String module = <span style={{ color: 'var(--accent-amber)' }}>&quot;OOP&quot;</span>;</p>
                  <p className="pl-4 pt-1"><span style={{ color: '#7dd3fc' }}>@Override</span></p>
                  <p className="pl-4"><span style={{ color: 'var(--accent-purple)' }}>public void</span> <span style={{ color: '#60a5fa' }}>run</span>() &#123;</p>
                  <p className="pl-8">System.out.println(<span style={{ color: 'var(--accent-amber)' }}>&quot;Running &quot;</span> + module);</p>
                  <p className="pl-4">&#125;</p>
                  <p>&#125;</p>
                </div>
              </div>

              {/* Stats bar */}
              <div
                className="animate-slide-right delay-600 flex items-center justify-between rounded-xl px-4 py-3 font-mono text-[11px]"
                style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
              >
                <span><span style={{ color: 'var(--accent)' }}>{posts?.length || 0}</span> lekcija</span>
                <span className="w-px h-3" style={{ background: 'var(--border-default)' }} />
                <span><span style={{ color: 'var(--accent)' }}>{categories?.length || 0}</span> kategorija</span>
                <span className="w-px h-3" style={{ background: 'var(--border-default)' }} />
                <span style={{ color: '#34d399' }}>● online</span>
              </div>
            </div>

          </div>
        </section>

        {/* ── Posts section ── */}
        <section id="lekcije" className="flex flex-col gap-6 scroll-mt-24">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'var(--border-subtle)' }} />
            <span className="font-mono text-xs px-3 py-1 rounded-full" style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-glow)' }}>
              lekcije
            </span>
            <div className="h-px flex-1" style={{ background: 'var(--border-subtle)' }} />
          </div>
          <PostFilter categories={categories || []} posts={posts || []} />
        </section>

      </main>

      {/* ── Footer ── */}
      <footer
        className="border-t py-6 px-6"
        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between font-mono text-xs">
          <span>prog<span style={{ color: 'var(--accent)' }}>blog</span> © {new Date().getFullYear()}</span>
          <span style={{ color: 'var(--text-muted)' }}>Built with Next.js + Supabase</span>
        </div>
      </footer>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center font-mono text-xs" style={{ background: 'var(--bg-base)', color: 'var(--text-secondary)' }}>
        Učitavanje platforme...
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}