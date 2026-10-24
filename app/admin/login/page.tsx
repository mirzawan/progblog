'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === 'admin@prog.ba' && password === 'admin123') {
      document.cookie = 'isAdmin=true; path=/;'
      router.push('/admin')
    } else {
      setError('Pogrešan email ili lozinka!')
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(94,234,212,0.07) 0%, transparent 70%)',
        }}
      />

      <div
        className="relative w-full max-w-md rounded-2xl p-8"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
      >
        {/* Logo & title */}
        <div className="flex items-center gap-3 mb-7">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-glow)' }}
          >
            <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--accent)' }}>admin_panel_settings</span>
          </div>
          <div>
            <h1 className="text-base font-bold font-mono" style={{ color: 'var(--text-primary)' }}>Admin Panel</h1>
            <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>Prijava za upravljanje lekcijama</p>
          </div>
        </div>

        {error && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-xs font-mono"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>Email adresa</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@prog.ba"
              className="admin-input text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>Lozinka</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="admin-input text-sm"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-3 rounded-xl font-mono text-sm font-bold transition"
            style={{ background: 'var(--accent)', color: '#0c0e14' }}
          >
            Prijavi se →
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-mono transition"
            style={{ color: 'var(--text-secondary)' }}
          >
            ← Nazad na početnu stranicu
          </Link>
        </div>
      </div>
    </div>
  )
}
