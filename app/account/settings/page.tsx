'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, User, Mail, Phone } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { updatePassword } from '@/lib/auth/client'

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      setSaving(false)
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      setSaving(false)
      return
    }

    try {
      const { error } = await updatePassword(newPassword)
      if (error) throw error
      setMessage({ type: 'success', text: 'Password updated successfully' })
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update password' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-warm-beige/40 grain-texture">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-cream rounded w-48 mb-8" />
            <div className="bg-cream rounded-2xl p-8">
              <div className="h-4 bg-warm-beige rounded w-32 mb-4" />
              <div className="h-12 bg-warm-beige rounded mb-4" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-warm-beige/40 grain-texture">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-12">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-ink mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>

        <h1 className="font-serif text-3xl text-ink mb-8">Settings</h1>

        <div className="max-w-2xl space-y-8">
          <div className="bg-cream rounded-2xl p-8 shadow-premium">
            <h2 className="font-serif text-xl text-ink mb-6">Profile Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={user?.user_metadata?.name || ''}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink"
                  />
                </div>
              </div>

              {user?.phone && (
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={user.phone}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-cream rounded-2xl p-8 shadow-premium">
            <h2 className="font-serif text-xl text-ink mb-6">Change Password</h2>

            {message.text && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm ${
                  message.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-600'
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                  placeholder="Min 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="bg-ink text-cream px-8 py-3 rounded-xl text-sm uppercase tracking-widest font-light hover:bg-ink/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
