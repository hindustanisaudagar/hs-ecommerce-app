'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Mail, User, Phone, Chrome } from 'lucide-react'
import { signUpWithEmail, signInWithGoogle, signInWithPhone } from '@/lib/auth/client'

export function SignupForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPhoneSignup, setShowPhoneSignup] = useState(false)
  const [phoneSent, setPhoneSent] = useState(false)

  const [emailForm, setEmailForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [phoneForm, setPhoneForm] = useState({ phone: '', otp: '' })

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (emailForm.password !== emailForm.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (emailForm.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { error } = await signUpWithEmail(emailForm.email, emailForm.password, emailForm.name)
      if (error) throw error
      setSuccess('Account created! Please check your email to verify.')
      setTimeout(() => router.push('/auth/login'), 2000)
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message || 'Google signup failed')
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
        <h2 className="font-serif text-2xl text-ink mb-2">Create Account</h2>
        <p className="text-muted-foreground mb-6">Join the Hindustani Saudagar family</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            {success}
          </div>
        )}

        {!showPhoneSignup ? (
          <>
            <form onSubmit={handleEmailSignup} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={emailForm.name}
                    onChange={(e) => setEmailForm({ ...emailForm, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                    placeholder="Your name"
                  />
                </div>
              </div>

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
                  minLength={6}
                  value={emailForm.password}
                  onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                  className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                  placeholder="Min 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={emailForm.confirmPassword}
                  onChange={(e) => setEmailForm({ ...emailForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink text-cream py-3 rounded-xl text-sm uppercase tracking-widest font-light hover:bg-ink/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
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
                onClick={handleGoogleSignup}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 border border-border/50 rounded-xl text-ink hover:bg-warm-beige transition-colors disabled:opacity-50"
              >
                <Chrome className="w-5 h-5" />
                <span className="text-sm">Continue with Google</span>
              </button>

              <button
                onClick={() => setShowPhoneSignup(true)}
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
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Create Account'}
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setShowPhoneSignup(false)
                setPhoneSent(false)
              }}
              className="w-full mt-4 text-sm text-muted-foreground hover:text-ink transition-colors"
            >
              ← Back to email signup
            </button>
          </>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-terracotta hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
