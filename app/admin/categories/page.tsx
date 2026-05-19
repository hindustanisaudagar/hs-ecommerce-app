'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, ChevronRight } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  children?: Category[]
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parent_id: '',
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories?hierarchical=true')
      const data = await res.json()
      setCategories(data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parent_id: formData.parent_id || null,
        }),
      })
      setShowForm(false)
      setFormData({ name: '', slug: '', description: '', parent_id: '' })
      fetchCategories()
    } catch (error) {
      console.error('Failed to create category:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will also delete subcategories.')) return

    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      fetchCategories()
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  const renderCategories = (cats: Category[], level = 0) => {
    return cats.map((category) => (
      <div key={category.id}>
        <tr className="hover:bg-warm-beige/30 transition-colors">
          <td className="px-6 py-4">
            <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
              {level > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              <p className="font-medium text-ink">{category.name}</p>
              {level === 0 && (
                <span className="text-xs text-muted-foreground bg-warm-beige/50 px-2 py-0.5 rounded">
                  Main
                </span>
              )}
              {level === 1 && (
                <span className="text-xs text-muted-foreground bg-warm-beige/50 px-2 py-0.5 rounded">
                  Sub
                </span>
              )}
              {level === 2 && (
                <span className="text-xs text-muted-foreground bg-warm-beige/50 px-2 py-0.5 rounded">
                  Sub-Sub
                </span>
              )}
            </div>
          </td>
          <td className="px-6 py-4">
            <p className="text-sm text-muted-foreground">{category.slug}</p>
          </td>
          <td className="px-6 py-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <button className="p-2 text-muted-foreground hover:text-terracotta transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
        {category.children && renderCategories(category.children, level + 1)}
      </div>
    ))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-2xl text-ink">Categories</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-ink text-cream px-6 py-3 rounded-xl text-sm hover:bg-ink/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-cream rounded-2xl p-8 shadow-premium mb-8 space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => {
                const slug = e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-|-$/g, '')
                setFormData({ ...formData, name: e.target.value, slug })
              }}
              className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
              placeholder="e.g., Dining, Storage, Decor"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Parent Category (optional)
            </label>
            <select
              value={formData.parent_id}
              onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
              className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
            >
              <option value="">None (Main Category)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty for main category, select parent for subcategory
            </p>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-ink text-cream px-6 py-3 rounded-xl text-sm hover:bg-ink/90 transition-colors"
            >
              Create Category
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-3 border border-border/50 rounded-xl text-sm text-ink hover:bg-warm-beige transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 bg-cream rounded-2xl">
          <p className="text-muted-foreground">No categories yet</p>
        </div>
      ) : (
        <div className="bg-cream rounded-2xl overflow-hidden shadow-premium">
          <table className="w-full">
            <thead className="bg-warm-beige/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Slug
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {renderCategories(categories)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
