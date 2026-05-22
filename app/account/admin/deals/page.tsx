'use client'

import React, { useState } from 'react'

export default function AdminDealsPage() {
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    alert("Bulk Order Page content updated! (Database integration pending)")
    setLoading(false)
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink mb-8">Manage Bulk & Wholesale Page</h1>
      
      <form onSubmit={handleUpdate} className="bg-cream rounded-2xl p-8 shadow-premium space-y-6">
        <p className="text-muted-foreground">
          This section will allow you to update the content of the Bulk Order & Deals page.
        </p>
        
        <div className="p-8 border-2 border-dashed border-border rounded-xl text-center">
          <p>Coming Soon: Form to update content and upload banner.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-ink text-cream px-6 py-3 rounded-xl text-sm hover:bg-ink/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
