'use client'

import React, { useState, useEffect } from 'react'
import { Loader2, Upload, X } from 'lucide-react'

export default function AdminDealsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<any>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/deals')
      const json = await res.json()
      setData(json)
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
      setData({ ...data, banner_url: json.url })
    } catch (e) {
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch('/api/admin/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      alert('Updated successfully!')
    } catch (e) {
      alert('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink mb-8">Manage Bulk & Wholesale Page</h1>
      
      <form onSubmit={handleSubmit} className="bg-cream rounded-2xl p-8 shadow-premium space-y-6">
        <div>
          <label className="block mb-2">Title</label>
          <input 
            value={data?.title || ''} 
            onChange={(e) => setData({...data, title: e.target.value})}
            className="w-full p-3 rounded-lg border"
          />
        </div>

        <div>
          <label className="block mb-2">Banner</label>
          {data?.banner_url ? (
            <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
              <img src={data.banner_url} alt="Banner" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setData({...data, banner_url: ''})} className="absolute top-2 right-2 bg-red-500 p-1 rounded-full"><X className="w-4 h-4 text-white"/></button>
            </div>
          ) : (
            <input type="file" onChange={handleUpload} disabled={uploading} className="w-full p-3 border rounded-lg" />
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-ink text-cream px-6 py-3 rounded-xl text-sm hover:bg-ink/90"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
