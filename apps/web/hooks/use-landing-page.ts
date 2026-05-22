import { useState, useEffect } from 'react'

interface LandingPageContent {
  [key: string]: any
}

export function useLandingPage(section?: string) {
  const [content, setContent] = useState<LandingPageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchContent()
  }, [section])

  const fetchContent = async () => {
    try {
      setLoading(true)
      setError(null)

      const url = section
        ? `/api/admin/landing-page?section=${section}`
        : '/api/admin/landing-page'

      const res = await fetch(url)

      if (!res.ok) {
        throw new Error('Failed to fetch landing page content')
      }

      const data = await res.json()
      setContent(data)
    } catch (err: any) {
      console.error('Error fetching landing page content:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateContent = async (section: string, content: any) => {
    try {
      const res = await fetch('/api/admin/landing-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, content }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to update content')
      }

      // Refresh content after update
      await fetchContent()

      return true
    } catch (err: any) {
      console.error('Error updating landing page content:', err)
      throw err
    }
  }

  return {
    content,
    loading,
    error,
    updateContent,
    refresh: fetchContent,
  }
}
