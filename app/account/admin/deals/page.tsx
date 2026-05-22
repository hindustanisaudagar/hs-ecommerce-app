'use client'

import React, { useState, useEffect } from 'react'
import { Loader2, X } from 'lucide-react'

export default function AdminDealsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<any>({ title: '', banner_url: '', content: {} })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/deals')
      if (!res.ok) {
        const err = await res.json()
        console.error('API error:', err)
        return
      }
      const json = await res.json()
      if (json && !json.error) setData(json)
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'bulk-banner')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Upload failed')
      setData((prev: any) => ({ ...prev, banner_url: json.url }))
    } catch (e: any) {
      alert(e.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        id: data.id,
        title: data.title,
        banner_url: data.banner_url,
        content: data.content,
      }
      const res = await fetch('/api/admin/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Save failed')
      }
      const saved = await res.json()
      setData(saved)
      alert('Updated successfully!')
    } catch (e: any) {
      alert(e.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading...</div>

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink mb-8">Manage Bulk & Wholesale Page</h1>

      <form onSubmit={handleSubmit} className="bg-cream rounded-2xl p-8 shadow-premium space-y-6">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Page Title</label>
          <input
            value={data?.title || ''}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">Banner Image</label>
          {data?.banner_url ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden bg-warm-beige border border-border/50">
              <img src={data.banner_url} alt="Banner" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setData({ ...data, banner_url: '' })} className="absolute top-2 right-2 bg-red-500 p-1.5 rounded-full hover:bg-red-600 transition-colors">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <div>
              <input type="file" onChange={handleUpload} disabled={uploading} className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-ink file:text-cream file:text-sm" />
              {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
            </div>
          )}
          {data?.banner_url && (
            <p className="text-xs text-green-600 mt-1">Banner URL: {data.banner_url.substring(0, 60)}...</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">Content (JSON)</label>
          <textarea
            value={JSON.stringify(data?.content || {}, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                setData({ ...data, content: parsed })
              } catch { }
            }}
            rows={15}
            className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink font-mono text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-ink text-cream px-6 py-3 rounded-xl text-sm hover:bg-ink/90 transition-colors disabled:opacity-50"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
