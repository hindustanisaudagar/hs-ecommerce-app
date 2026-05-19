'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Mail, Phone, Chrome } from 'lucide-react'
import { signInWithEmail, signInWithGoogle, signInWithPhone } from '@/lib/auth/client'

export function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPhoneLogin, setShowPhoneLogin] = useState(false)
  const [phoneSent, setPhoneSent] = useState(false)

  const [emailForm, setEmailForm] = useState({ email: '', password: '' })
  const [phoneForm, setPhoneForm] = useState({ phone: '', otp: '' })

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await signInWithEmail(emailForm.email, emailForm.password)
      if (error) throw error
      router.push('/account')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message || 'Google login failed')
      setLoading(false)
    }
  }

  const handlePhoneSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await signInWithPhone(phoneForm.phone)
      if (error) throw error
      setPhoneSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { verifyPhoneOtp } = await import('@/lib/auth/client')
      const { error } = await verifyPhoneOtp(phoneForm.phone, phoneForm.otp)
      if (error) throw error
      router.push('/account')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-cream rounded-2xl p-8 shadow-premium">
        <h2 className="font-serif text-2xl text-ink mb-2">Welcome Back</h2>
        <p className="text-muted-foreground mb-6">Login to your account</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {!showPhoneLogin ? (
          <>
            <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={emailForm.email}
                    onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={emailForm.password}
                  onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                  className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex justify-between items-center">
                <Link href="/auth/forgot-password" className="text-sm text-terracotta hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink text-cream py-3 rounded-xl text-sm uppercase tracking-widest font-light hover:bg-ink/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Login'}
              </button>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-cream text-muted-foreground">or continue with</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 border border-border/50 rounded-xl text-ink hover:bg-warm-beige transition-colors disabled:opacity-50"
              >
                <Chrome className="w-5 h-5" />
                <span className="text-sm">Continue with Google</span>
              </button>

              <button
                onClick={() => setShowPhoneLogin(true)}
                className="w-full flex items-center justify-center gap-3 py-3 border border-border/50 rounded-xl text-ink hover:bg-warm-beige transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="text-sm">Continue with Phone</span>
              </button>
            </div>
          </>
        ) : (
          <>
            {!phoneSent ? (
              <form onSubmit={handlePhoneSend} className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      required
                      value={phoneForm.phone}
                      onChange={(e) => setPhoneForm({ ...phoneForm, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-ink text-cream py-3 rounded-xl text-sm uppercase tracking-widest font-light hover:bg-ink/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePhoneVerify} className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Enter OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={phoneForm.otp}
                    onChange={(e) => setPhoneForm({ ...phoneForm, otp: e.target.value })}
                    className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                    placeholder="••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-ink text-cream py-3 rounded-xl text-sm uppercase tracking-widest font-light hover:bg-ink/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify OTP'}
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setShowPhoneLogin(false)
                setPhoneSent(false)
              }}
              className="w-full mt-4 text-sm text-muted-foreground hover:text-ink transition-colors"
            >
              ← Back to email login
            </button>
          </>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-terracotta hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
