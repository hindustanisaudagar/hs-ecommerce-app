'use client'

import React, { useState, useEffect, useRef } from 'react'

interface Category {
  id: string
  name: string
  level: number
  label: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parent_id: '',
    image: '',
    is_active: true,
  })
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories?hierarchical=true&onlyActive=false')
      const data = await res.json()
      setCategories(data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const flattenCategories = (cats: Category[], level = 0, prefix = ''): FlatCategory[] => {
    let result: FlatCategory[] = []
    for (const cat of cats) {
      result.push({
        id: cat.id,
        name: cat.name,
        level,
        label: prefix + cat.name,
      })
      if (cat.children && cat.children.length > 0) {
        result = result.concat(
          flattenCategories(cat.children, level + 1, prefix + '— ')
        )
      }
    }
    return result
  }

  const flatCategories = flattenCategories(categories)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Cloudinary
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'categories')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await res.json()
      setFormData({ ...formData, image: data.url })
    } catch (error: any) {
      alert(error.message || 'Upload failed')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setFormData({ ...formData, image: '' })
    setPreviewImage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parent_id: formData.parent_id || null,
          image: formData.image || null,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to save category')
      }

      setShowForm(false)
      setEditingId(null)
      setFormData({ name: '', slug: '', description: '', parent_id: '', image: '' })
      setPreviewImage('')
      fetchCategories()
    } catch (error: any) {
      alert(error.message || 'Failed to save category')
      console.error('Failed to save category:', error)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parent_id: category.parent_id || '',
      image: category.image || '',
      is_active: category.is_active ?? true,
    })
    setPreviewImage(category.image || '')
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will also delete subcategories.')) return

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to delete category')
      }
      
      fetchCategories()
    } catch (error: any) {
      alert(error.message || 'Failed to delete category')
      console.error('Failed to delete category:', error)
    }
  }

  const renderCategories = (cats: Category[], level = 0) => {
    return cats.map((category) => (
      <React.Fragment key={category.id}>
        <tr className={`hover:bg-warm-beige/30 transition-colors ${!category.is_active ? 'opacity-50' : ''}`}>
          <td className="px-6 py-4">
            <div className="flex items-center gap-3" style={{ paddingLeft: `${level * 24}px` }}>
              {category.image ? (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-warm-beige flex-shrink-0">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-warm-beige/50 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-muted-foreground">No img</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                {level > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                <p className="font-medium text-ink">{category.name}</p>
                {!category.is_active && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Disabled</span>}
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
            </div>
          </td>
          <td className="px-6 py-4">
            <p className="text-sm text-muted-foreground">{category.slug}</p>
          </td>
          <td className="px-6 py-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => handleEdit(category)}
                className="p-2 text-muted-foreground hover:text-terracotta transition-colors"
              >
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
      </React.Fragment>
    ))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-2xl text-ink">Categories</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (showForm) {
              setEditingId(null)
              setFormData({ name: '', slug: '', description: '', parent_id: '', image: '' })
              setPreviewImage('')
            }
          }}
          className="flex items-center gap-2 bg-ink text-cream px-6 py-3 rounded-xl text-sm hover:bg-ink/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-cream rounded-2xl p-8 shadow-premium mb-8 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-medium text-ink text-lg">
              {editingId ? 'Edit Category' : 'Add New Category'}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
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
                placeholder="Category name"
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
                {flatCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty for main category, select parent for subcategory
              </p>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Category Image
            </label>
            <div className="flex items-start gap-6">
              {/* Preview */}
              {(previewImage || formData.image) && (
                <div className="relative">
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-warm-beige border border-border/50">
                    <Image
                      src={previewImage || formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Upload Area */}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-6 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink hover:bg-warm-beige transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: 800x1000px, Max 2MB, JPG/PNG
                </p>
              </div>
            </div>
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
              placeholder="Brief description of this category"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 rounded border-border/50 text-terracotta focus:ring-terracotta"
            />
            <label className="text-sm text-ink">Active (visible on store)</label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border/50">
            <button
              type="submit"
              disabled={uploading}
              className="bg-ink text-cream px-6 py-3 rounded-xl text-sm hover:bg-ink/90 transition-colors disabled:opacity-50"
            >
              {editingId ? 'Update Category' : 'Create Category'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
                setFormData({ name: '', slug: '', description: '', parent_id: '', image: '' })
                setPreviewImage('')
              }}
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
          <p className="text-sm text-muted-foreground mt-2">Click "Add Category" to create one</p>
        </div>
      ) : (
        <div className="bg-cream rounded-2xl overflow-hidden shadow-premium">
          <table className="w-full">
            <thead className="bg-warm-beige/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Category
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
